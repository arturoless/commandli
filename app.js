#!/usr/bin/env node

const [,, ...args] = process.argv
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const inquirer = require('inquirer')
const shell = require('shelljs')
var fs = require('fs')
var cron = require('node-cron')
clear()

console.log(
    chalk.red(
        figlet.textSync('EMACLI',{horizontalLayout: 'full'})
    )
    
)
function main(){
    inquirer.prompt([
        {
            name: 'remitente',
            type: 'input',
            message: 'Ingrese el correo remitente:'
        },
        {
            name: 'destinatario',
            type: 'input',
            message: 'Ingrese el correo destinatario:'
        },
        {
            name: 'asunto',
            type: 'input',
            message: 'Ingrese el asunto:'
        },
        {
            name: 'cuerpo',
            type: 'input',
            message: 'Ingrese el cuerpo del correo:'
        },
    ]).then(answers =>{
        console.log('Creating python file.')
        var stream = fs.createWriteStream('./correo.py');
        stream.once('open', function(fd) {
            stream.write('import sys\n')
            stream.write('import smtplib, ssl\n')
            stream.write('port = 587\n')
            stream.write('smtp_server = "smtp.gmail.com"\n')
            stream.write('sender_email ='+'"'+answers['remitente']+'"'+'\n')
            stream.write('receiver_email = '+'"'+answers['destinatario']+'"'+'\n')
            stream.write('password = "ifmuqpplkiyfmghi"\n')
            stream.write('subject='+'"'+answers['asunto']+'"'+'\n')
            stream.write('text='+'"'+answers['cuerpo']+'"'+'\n')
            stream.write('message='+"'Subject: {}"+"\\n"+"\\n"+"{}'"+'.format(subject, text)\n')
            stream.write('context = ssl.create_default_context()\n')
            stream.write('with smtplib.SMTP(smtp_server, port) as server:\n')
            stream.write('  server.starttls(context=context)\n')
            stream.write('  server.login(sender_email, password)\n')
            stream.write('  server.sendmail(sender_email, receiver_email, message)\n')
            stream.end();
        });
        console.log('Successfully created correo.py file.')
        cron.schedule('* * * * *', () => {
            shell.exec('python3 correo.py')
        });
        
    })
}
main()

