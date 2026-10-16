from concurrent.futures import ThreadPoolExecutor

import httpx


payload = {
    "name": "Проверка дублей",
    "phone": "+375291234567",
    "interest": "order",
    "comment": "Проверка двух одновременных запросов",
}


def send_request(_):
    response = httpx.post(
        "http://127.0.0.1:8000/api/lead",
        json=payload,
        timeout=20,
    )

    return response.status_code, response.json()


with ThreadPoolExecutor(max_workers=2) as executor:
    results = list(executor.map(send_request, range(2)))

for result in results:
    print(result)