import json

print('Salon Lambda 2 is ONLINE....');

def lambda_handler(event, context):

    try:
        print ('Salon Lambda 2 Handler Triggered....');
    
        return {
            'statusCode': 200,
            'body': json.dumps('Shortcut....')
        }
    
        # Print the event details for debugging
        print("Received event: ")
        print(json.dumps(event))


    
        # Print the event details for debugging
        print("What = " + event['what'])
        print("Where = " + event['where'])
        print("When = " + event['when'])
        print("Budget = " + event['budget'])
        print("Mood = " + event['mood'])

        # Echo back the first key value
        #return event['what']  
    
        return {
            'statusCode': 200,
            'body': json.dumps('Hello! from Salon Lambda2. Event = ' + event['what'])
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 200,
            'body': json.dumps('Exception! from Salon Lambda2. Event = ' + event['what'])
        }
 
    


def do_something():
    print('Salon Doing Something')
    return 'Salon Doing Something'
