import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для работы с сообщениями и чатами семейного мессенджера'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        path = event.get('queryStringParameters', {})
        action = path.get('action', 'get_chats')
        
        if action == 'get_chats':
            cur.execute('''
                SELECT 
                    c.id as chat_id,
                    u.id as contact_id,
                    u.name as contact_name,
                    u.initials,
                    u.status,
                    u.avatar,
                    m.text as last_message,
                    TO_CHAR(m.created_at, 'HH24:MI') as time,
                    (SELECT COUNT(*) FROM messages WHERE chat_id = c.id AND sender_id != 1 AND created_at > CURRENT_TIMESTAMP - INTERVAL '1 hour') as unread
                FROM chats c
                JOIN users u ON (u.id = c.user2_id AND c.user1_id = 1) OR (u.id = c.user1_id AND c.user2_id = 1)
                LEFT JOIN LATERAL (
                    SELECT text, created_at 
                    FROM messages 
                    WHERE chat_id = c.id 
                    ORDER BY created_at DESC 
                    LIMIT 1
                ) m ON true
                WHERE u.id != 1
                ORDER BY m.created_at DESC NULLS LAST
            ''')
            
            chats = []
            for row in cur.fetchall():
                chats.append({
                    'id': row[0],
                    'contact': {
                        'id': row[1],
                        'name': row[2],
                        'initials': row[3],
                        'status': row[4],
                        'avatar': row[5] or ''
                    },
                    'lastMessage': row[6] or '',
                    'time': row[7] or '',
                    'unread': row[8]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'chats': chats})
            }
        
        elif action == 'get_messages':
            chat_id = path.get('chat_id')
            if not chat_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'chat_id required'})
                }
            
            cur.execute('''
                SELECT 
                    m.id,
                    m.text,
                    m.sender_id,
                    TO_CHAR(m.created_at, 'HH24:MI') as time
                FROM messages m
                WHERE m.chat_id = %s
                ORDER BY m.created_at ASC
            ''', (chat_id,))
            
            messages = []
            for row in cur.fetchall():
                messages.append({
                    'id': row[0],
                    'text': row[1],
                    'sent': row[2] == 1,
                    'time': row[3]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'messages': messages})
            }
        
        elif action == 'send_message' and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            chat_id = body.get('chat_id')
            text = body.get('text', '').strip()
            
            if not chat_id or not text:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'chat_id and text required'})
                }
            
            cur.execute('''
                INSERT INTO messages (chat_id, sender_id, text, created_at)
                VALUES (%s, 1, %s, CURRENT_TIMESTAMP)
                RETURNING id, text, TO_CHAR(created_at, 'HH24:MI') as time
            ''', (chat_id, text))
            
            result = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': {
                        'id': result[0],
                        'text': result[1],
                        'sent': True,
                        'time': result[2]
                    }
                })
            }
        
        elif action == 'get_contacts':
            cur.execute('''
                SELECT id, name, initials, status, avatar
                FROM users
                WHERE id != 1
                ORDER BY name
            ''')
            
            contacts = []
            for row in cur.fetchall():
                contacts.append({
                    'id': row[0],
                    'name': row[1],
                    'initials': row[2],
                    'status': row[3],
                    'avatar': row[4] or ''
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'contacts': contacts})
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Unknown action'})
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    
    finally:
        cur.close()
        conn.close()
