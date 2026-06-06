import unittest
import re

from app import app


class KanaAppTestCase(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True)
        self.client = app.test_client()

    def test_home_page_loads(self):
        with self.client.get("/") as response:
            self.assertEqual(response.status_code, 200)
            self.assertIn(b"Kana Garden", response.data)
            self.assertIn(b"manifest.webmanifest", response.data)

    def test_pwa_files_are_served(self):
        for path in (
            "/manifest.webmanifest",
            "/service-worker.js",
            "/static/app.js",
            "/static/style.css",
            "/icons/icon.svg",
        ):
            with self.subTest(path=path):
                with self.client.get(path) as response:
                    self.assertEqual(response.status_code, 200)

    def test_quiz_is_client_side(self):
        with self.client.get("/static/app.js") as response:
            javascript = response.get_data(as_text=True)
        self.assertIn("const KANA", javascript)
        self.assertIn("const KANJI", javascript)
        self.assertIn("localStorage", javascript)
        self.assertNotIn("/api/question", javascript)
        self.assertNotIn("/api/check", javascript)

    def test_kanji_deck_contains_fifty_characters(self):
        with self.client.get("/static/app.js") as response:
            javascript = response.get_data(as_text=True)
        kanji_block = javascript.split("const KANJI = [", 1)[1].split("].map(", 1)[0]
        entries = re.findall(r'\["[\u3400-\u9fff]"', kanji_block)
        self.assertEqual(len(entries), 50)


if __name__ == "__main__":
    unittest.main()
