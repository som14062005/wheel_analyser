import requests
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# === CONFIG ===
ALERT_WINDOW_DAYS = 7
API_URL = "http://localhost:5001/predict"
SENDER_EMAIL = "praveensomasundaram2005@gmail.com"
SENDER_PASSWORD = "lqov qcbc ngak rpjm"  # Use Gmail App Password (never share real password publicly)

# Hardcoded train incharge emails
train_incharge_emails = {
    "cmrltr52": "incharge52@cmrl.com",
    "cmrltr1":"230701248@rajalakshmi.edu.in",
    # Add more as needed
}


def send_email(recipient, subject, body):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = recipient
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ Email sent to {recipient}")
    except Exception as e:
        print(f"❌ Failed to send email to {recipient}: {e}")


def check_and_send_alerts():
    today = datetime.now().date()
    deadline = today + timedelta(days=ALERT_WINDOW_DAYS)

    for i in range(1, 53):  # cmrltr1 to cmrltr52
        train_id = f"cmrltr{i}"
        try:
            res = requests.get(f"{API_URL}/{train_id}")
            if res.status_code != 200:
                continue

            data = res.json()
            if not isinstance(data, list):
                continue

            body_lines = []

            for item in data:
                for side in ["LH", "RH"]:
                    side_data = item.get("after", {}).get(side)
                    if side_data:
                        expected_date = datetime.strptime(
                            side_data["expected_replacement_date"], "%Y-%m-%d"
                        ).date()
                        if today <= expected_date <= deadline:
                            line = f"{item['wheelId']} {side} ➜ {expected_date} (Install: {side_data['install_date']})"
                            body_lines.append(line)

            if body_lines:
                recipient = train_incharge_emails.get(train_id, SENDER_EMAIL)  # fallback to your email
                subject = f"🚨 Wheel Replacement Alert for {train_id}"
                body = "The following wheels need replacement soon:\n\n" + "\n".join(body_lines)
                send_email(recipient, subject, body)
            else:
                print(f"ℹ️ No alerts needed for {train_id}")

        except Exception as e:
            print(f"❌ Error processing {train_id}: {e}")


def send_email_alert(train_id, wheel_id, side, expected_date, install_date, rul):
    recipient = train_incharge_emails.get(train_id, SENDER_EMAIL)  # fallback to your email
    subject = f"🚨 Test: Wheel Alert for {train_id}"
    body = (
        f"Train: {train_id}\n"
        f"Wheel: {wheel_id} ({side})\n"
        f"Expected Replacement: {expected_date}\n"
        f"Installed On: {install_date}\n"
        f"Remaining Useful Life: {rul} days"
    )
    send_email(recipient, subject, body)


# Run email alerts when executed standalone
if __name__ == "__main__":
    check_and_send_alerts()
