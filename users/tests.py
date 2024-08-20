from django.test import TestCase, Client
from django.urls import reverse


class InterestTest(TestCase):
    # fixtures = ["datas.json"]
    def setUp(self):
        self.client = Client()
        for user in ['zuhail','sumee','sufail','saji','vahee','nusra']:
            self.client.post('/dj-rest-auth/registration/',{'username':user,'password1':'suhail412','password2':'suhail412'})
        self.user_url = reverse('users:user')
        response = self.client.post('/dj-rest-auth/login/',{'username':'zuhail','password':'suhail412'})
        
        self.HEADERS_ZUHAIL = {'HTTP_AUTHORIZATION':f'Token {response.json()['key']}'}
        response = self.client.post('/dj-rest-auth/login/',{'username':'sumee','password':'suhail412'})
        self.HEADERS_SUMEE = {'HTTP_AUTHORIZATION':f'Token {response.json()['key']}'}
    def test_user_listing(self):
        """
        request_user: zuhail

        users  interest
        ------ -------
        sumee  accepted         (sender: suhail, receiver sumee, status: accepted) 
                                or (sender: sumee, receiver suhail, status: accepted)

        sufail declined         (sender: suhail, receiver sufail, status: declined)
                                or (sender: sufail, receiver suhail, status: declined)

        saji   accept/decline invite     (sender: saji, receiver suhail, status: pending)

        vahee  pending          (sender: suhail, receiver vahee, status: pending)
        
        nusra  none             (None)
        """

        # create_interest zuhail -> sumee
        self.client.post(self.user_url,{'userid':'2'}, **self.HEADERS_ZUHAIL)
        response = self.client.get(self.user_url, **self.HEADERS_ZUHAIL)
        self.assertEqual(response.status_code,200)
        response_json = response.json()        
        self.assertIn({'id': 2, 'username': 'sumee', 'interest_status': 'pending'}, response_json)
        
        # accept zuhail's interest by sumee
        self.client.post(self.user_url,{'userid':'1'}, **self.HEADERS_SUMEE)
        response = self.client.get(self.user_url, **self.HEADERS_SUMEE)
        self.assertEqual(response.status_code,200)
        print(response.json())