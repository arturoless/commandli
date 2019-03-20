import sys
import smtplib, ssl
port = 587
smtp_server = "smtp.gmail.com"
sender_email ="arturo.lessieur@gmail.com"
receiver_email = "173208@ids.upchiapas.edu.mx"
password ="ifmuqpplkiyfmghi"
subject="a"
text="a"
message='Subject: {}\n\n{}'.format(subject, text)
context = ssl.create_default_context()
with smtplib.SMTP(smtp_server, port) as server:
  server.starttls(context=context)
  server.login(sender_email, password)
  server.sendmail(sender_email, receiver_email, message)
