import json
import os
import psycopg2

SCHEMA = 't_p52708701_local_info_system'

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """CRUD для резюме: GET список, POST создать, PUT обновить, DELETE удалить."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}

    with get_conn() as conn:
        with conn.cursor() as cur:

            if method == 'GET':
                cur.execute(f"""
                    SELECT id, name, position, location, salary_expected, experience,
                           skills, education, age, updated_at, summary, status
                    FROM {SCHEMA}.resumes
                    ORDER BY id DESC
                """)
                rows = cur.fetchall()
                cols = ['id','name','position','location','salaryExpected','experience',
                        'skills','education','age','updatedAt','summary','status']
                result = []
                for row in rows:
                    item = dict(zip(cols, row))
                    item['updatedAt'] = str(item['updatedAt'])
                    result.append(item)
                return {'statusCode': 200, 'headers': cors, 'body': json.dumps(result, ensure_ascii=False)}

            if method == 'POST':
                body = json.loads(event.get('body') or '{}')
                cur.execute(f"""
                    INSERT INTO {SCHEMA}.resumes
                      (name, position, location, salary_expected, experience, skills, education, age, updated_at, summary, status)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    RETURNING id
                """, (
                    body.get('name',''), body.get('position',''), body.get('location',''),
                    body.get('salaryExpected',0), body.get('experience',''),
                    body.get('skills',[]), body.get('education',''),
                    body.get('age',0), body.get('updatedAt', None),
                    body.get('summary',''), body.get('status','active'),
                ))
                new_id = cur.fetchone()[0]
                conn.commit()
                return {'statusCode': 201, 'headers': cors, 'body': json.dumps({'id': new_id})}

            if method == 'PUT':
                resume_id = params.get('id')
                body = json.loads(event.get('body') or '{}')
                cur.execute(f"""
                    UPDATE {SCHEMA}.resumes
                    SET name=%s, position=%s, location=%s, salary_expected=%s, experience=%s,
                        skills=%s, education=%s, age=%s, updated_at=%s, summary=%s, status=%s
                    WHERE id=%s
                """, (
                    body.get('name',''), body.get('position',''), body.get('location',''),
                    body.get('salaryExpected',0), body.get('experience',''),
                    body.get('skills',[]), body.get('education',''),
                    body.get('age',0), body.get('updatedAt', None),
                    body.get('summary',''), body.get('status','active'),
                    int(resume_id),
                ))
                conn.commit()
                return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

            if method == 'DELETE':
                resume_id = params.get('id')
                cur.execute(f"DELETE FROM {SCHEMA}.resumes WHERE id=%s", (int(resume_id),))
                conn.commit()
                return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}
