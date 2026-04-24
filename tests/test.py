from requests import post


headers = {
    'Client-ID': 'qfc45b1a091jqnjulvlsz6g0n7x62e',
    'Authorization': 'Bearer n5ahdx48kanb973pbxa5g3lidx69x9'
}

query = 'fields alpha_channel,animated,checksum,game,game_localization,height,image_id,url,width;'

response = post('https://api.igdb.com/v4/covers',
                **{'headers': headers,
                   'data': query})

print("response: %s" % str(response.json()))
