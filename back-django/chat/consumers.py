import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from account.models import MessagePrivate, ChatPrivate,ChatGroup,MessageGroup
from .db_operation import *

class ChatPrivateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            self.room_name = user.id
            self.room_group_name = 'chat_private_%s' % self.room_name

            # Join room group
            print(f'connection to room : {self.room_group_name} by {user.id}')
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            chat_groups = await getAllChatGroup(user)
            for chat_group in chat_groups:
                print(f'connection to room : {chat_group.id} by {user.id}')
                await self.channel_layer.group_add(
                    'chat_group_%s' % str(chat_group.id),
                    self.channel_name
                )
            await self.accept()
        else :
            print(f'connexion fails : user : {user} not authenticate')
            await self.close(code=4001)

    async def disconnect(self, close_code):
        # Leave room group
        if close_code != 4001 and getattr(self, 'user', None) is not None:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        type_message = text_data_json['type']


        if type_message == 'chat_message_private':  
            user_to = text_data_json['user_to']
            user_from = text_data_json['user_from']

            print(f'{type_message} receive from {user_from} to {user_to}')

            #user id to user User
            user_from = await getUserById(user_from)
            user_to = await getUserById(user_to)     
            message = text_data_json['message']
            # Send message to user_to group
            if user_from and user_to and user_to.id != user_from.id:
                await self.channel_layer.group_send(
                    'chat_private_%s' % str(user_to.id),
                    {
                        'type': type_message,
                        'user_from' : user_from.id,
                        'user_to' : user_to.id,
                        'message': message,
                    }
                )
                # Send message to user_from group
                await self.channel_layer.group_send(
                    'chat_private_%s' % str(user_from.id),
                    {
                        'type': type_message,
                        'user_from' : user_from.id,
                        'user_to' : user_to.id,
                        'message': message,
                    }
                )

            #save message 
                await createPrivateMessage(user_from=user_from,user_to=user_to,message=message)
        elif type_message == 'chat_message_group':  
            user_from = text_data_json['user_from']
            chat_group_id = text_data_json['chat_group']

            print(f'{type_message} receive from {user_from} to chat {chat_group_id}')

            #user id to user User
            user_from = await getUserById(user_from)
            chat_group = await getIdChatGroup(chat_group_id)
            message = text_data_json['message']

            print(f'{type_message} send from {user_from} to chat {chat_group_id}')
            # Send message to user_to group
            await self.channel_layer.group_send(
                'chat_group_%s' % str(chat_group_id),
                {
                    'type': type_message,
                    'user_from' : user_from.id,
                    'chat_group' : chat_group_id,
                    'message': message,
                }
            )

            #save message 
            await createGroupMessage(user_from=user_from,chat_group=chat_group,message=message)
        elif(type_message == "friend_request"):
            user_to = text_data_json['user_to']
            user_from = text_data_json['user_from']

            print(f'{type_message} receive from {user_from} to {user_to}')

            #user id to user User
            user_from = await getUserById(user_from)
            user_to = await getUserById(user_to)     
            print('add friend request to list')
            await addToRequestList(user_from,user_to)
            
            await self.channel_layer.group_send(
                    'chat_private_%s' % str(user_to.id),
                    {
                        'type': type_message,
                        'user_from' : user_from.id,
                        'user_to' : user_to.id,
                    }
                )


        elif(type_message == "friend_response"):
            user_to = text_data_json['user_to']
            user_from = text_data_json['user_from']

            print(f'{type_message} receive from {user_from} to {user_to}')

            #user id to user User
            user_from = await getUserById(user_from)
            user_to = await getUserById(user_to)     
            accept = text_data_json['accept']
            print('delete friend request to list')
            await deleteToRequestList(user_from,user_to)
            if accept:
                print('add user to friendList')
                await addToFriendList(user_from,user_to)
        elif(type_message == "watched_message_private"):
            user_to = text_data_json['user_to']
            user_from = text_data_json['user_from']

            print(f'{type_message} receive from {user_from} to {user_to}')

            #user id to user User
            user_from = await getUserById(user_from)
            user_to = await getUserById(user_to)     
            print(f"watched all message private from {user_from} to {user_to}")
            await watchedAllMessagePrivate(user_from,user_to)
            await self.channel_layer.group_send(
                'chat_private_%s' % str(user_to.id),
                {
                    'type': type_message,
                    'user_from' : user_from.id,
                    'user_to' : user_to.id,
                }
            )
            # Send message to user_from group
            await self.channel_layer.group_send(
                'chat_%s' % str(user_from.id),
                {
                    'type': type_message,
                    'user_from' : user_from.id,
                    'user_to' : user_to.id,
                }
            )
        elif(type_message == "watched_message_group"):
            chat_group = text_data_json['chat_group']
            user_from = text_data_json['user_from']

            print(f'{type_message} receive from {user_from} to {chat_group}')
            chat_group = await getChatGroup(chat_group)
            user_from = await getUserById(user_from)
            print(f"watched all message group from {user_from} to {chat_group.id}")
            await watchedAllMessageGroup(user_from,chat_group)
            await self.channel_layer.group_send(
                'chat_group_%s' % str(chat_group.id),
                {
                    'type': type_message,
                    'user_from' : user_from.id,
                    'chat_group' : chat_group.id,
                }
            )
        else:
            print("else")




    # Receive message from room private
    async def chat_message_private(self, event):
        message = event['message']
        user_to = event['user_to']
        user_from = event['user_from']
        type_message = event['type']
        chat_id= await getIdChatPrivate(user_from, user_to)

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'user_from' : user_from,
            'user_to' : user_to,
            'message': message,
            'chat_id':chat_id.id,
            'type':type_message,
        }))

    # Receive message from room group
    async def chat_message_group(self, event):
        message = event['message']
        chat_group = event['chat_group']
        user_from = event['user_from']
        type_message = event['type']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'user_from' : user_from,
            'chat_group':chat_group,
            'type':type_message,

        }))

    # Receive message from room group
    async def watched_message_private(self, event):
        user_to = event['user_to']
        user_from = event['user_from']
        type_message = event['type']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'user_from' : user_from,
            'user_to' : user_to,
            'type':type_message,
        }))

    # Receive message from room group
    async def watched_message_group(self, event):
        chat_group = event['chat_group']
        user_from = event['user_from']
        type_message = event['type']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'user_from' : user_from,
            'chat_group' : chat_group,
            'type':type_message,
        }))

    # Receive message from room group
    async def friend_request(self, event):
        user_from = event['user_from']
        user_to = event['user_to']
        type_message = event['type']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'user_to' : user_to,
            'user_from' : user_from,
            'type':type_message,
        }))