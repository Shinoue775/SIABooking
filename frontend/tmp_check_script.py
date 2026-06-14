from pathlib import Path
import re, subprocess
path = Path('resources/views/pages/booking.blade.php')
text = path.read_text(encoding='utf-8')
start = text.rfind('<script>')
end = text.rfind('</script>')
if start < 0 or end < 0:
    raise SystemExit('NO SCRIPT')
script = text[start+8:end]
script = re.sub(r"const BOOKING_API_BASE = @json\(config\('services\.booking_api\.base_url'\)\)(\s*\|\|\s*window\.location\.origin)?;", 'const BOOKING_API_BASE = "http://127.0.0.1:3001";', script)
with open('tmp_booking_script.js', 'w', encoding='utf-8') as f:
    f.write(script)
res = subprocess.run(['node', 'tmp_booking_script.js'], capture_output=True, text=True)
print('RC', res.returncode)
print('STDERR', res.stderr)
print('STDOUT', res.stdout)
