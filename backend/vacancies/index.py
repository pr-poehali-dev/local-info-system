import json
import os
import psycopg2

SCHEMA = 't_p52708701_local_info_system'

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """CRUD для вакансий: GET список, POST создать, PUT обновить, DELETE удалить."""
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
                    SELECT id, title, company, location, salary_min, salary_max,
                           experience, skills, type, posted_at, description, status
                    FROM {SCHEMA}.vacancies
                    ORDER BY id DESC
                """)
                rows = cur.fetchall()
                cols = ['id','title','company','location','salaryMin','salaryMax',
                        'experience','skills','type','postedAt','description','status']
                result = []
                for row in rows:
                    item = dict(zip(cols, row))
                    item['postedAt'] = str(item['postedAt'])
                    result.append(item)
                return {'statusCode': 200, 'headers': cors, 'body': json.dumps(result, ensure_ascii=False)}

            if method == 'POST':
                body = json.loads(event.get('body') or '{}')
                cur.execute(f"""
                    INSERT INTO {SCHEMA}.vacancies
                      (title, company, location, salary_min, salary_max, experience, skills, type, posted_at, description, status)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    RETURNING id
                """, (
                    body.get('title',''), body.get('company',''), body.get('location',''),
                    body.get('salaryMin',0), body.get('salaryMax',0), body.get('experience',''),
                    body.get('skills',[]), body.get('type','Полный день'),
                    body.get('postedAt', None), body.get('description',''),
                    body.get('status','active'),
                ))
                new_id = cur.fetchone()[0]
                conn.commit()
                return {'statusCode': 201, 'headers': cors, 'body': json.dumps({'id': new_id})}

            if method == 'PUT':
                vacancy_id = params.get('id')
                body = json.loads(event.get('body') or '{}')
                cur.execute(f"""
                    UPDATE {SCHEMA}.vacancies
                    SET title=%s, company=%s, location=%s, salary_min=%s, salary_max=%s,
                        experience=%s, skills=%s, type=%s, posted_at=%s, description=%s, status=%s
                    WHERE id=%s
                """, (
                    body.get('title',''), body.get('company',''), body.get('location',''),
                    body.get('salaryMin',0), body.get('salaryMax',0), body.get('experience',''),
                    body.get('skills',[]), body.get('type','Полный день'),
                    body.get('postedAt', None), body.get('description',''),
                    body.get('status','active'), int(vacancy_id),
                ))
                conn.commit()
                return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

            if method == 'DELETE':
                vacancy_id = params.get('id')
                cur.execute(f"DELETE FROM {SCHEMA}.vacancies WHERE id=%s", (int(vacancy_id),))
                conn.commit()
                return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}
