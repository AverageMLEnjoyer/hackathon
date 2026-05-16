import os

def load_target_sites() -> list[str]:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, "sites.txt")

    if not os.path.exists(file_path):
        return ["wikipedia.org", "google.com"]

    with open(file_path, "r", encoding="utf-8") as f:
        sites = [line.strip() for line in f if line.strip()]
    return sites