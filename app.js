#!/usr/bin/env node

const [,, ...args] = process.argv
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const inquirer = require('inquirer')
const shell = require('shelljs')
var nodemailer = require('nodemailer')
var fs = require('fs')
var cron = require('node-cron')
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('%s');
spinner.setSpinnerString('|/-\\')

clear()

console.log(
    chalk.yellow(
        figlet.textSync('MANGO',{horizontalLayout: 'full'})
    ),
    chalk.red(
        figlet.textSync('CLI',{horizontalLayout: 'full'})
    )
    
)
main()
function main(){
    if(args.length>0){
        comando = args[0]
        if(comando === 'empezar' && args.length===2){
            nombre_proyecto=args[1]
            empezar(nombre_proyecto)
        }
        else if(comando === 'generar' && args.length===2){
            componente=args[1]
            mail(comṕonente)
        }
    }
}
function empezar(nombre){
    spinner.start();
    console.log('Creando proyecto ' + nombre)
    try {
        shell.exec('mkdir '+nombre_proyecto)
        spinner.stop()
        shell.exec('cd '+nombre_proyecto)
    } catch (error) {
        console.log('Ya existe esa wea prro')
    }
    
} 
function mail(componente){
    inquirer.prompt([
        {
            name: 'remitente',
            type: 'input',
            message: 'Ingrese el correo remitente:'
        },
        {
            name: 'password',
            type: 'password',
            message: 'Ingrese la constraseña de aplicación:'
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
        spinner.start();
        console.log('Creating python file.')
        shell.exec('mkdir '+componente)
        var path = componente +'/'+componente+'.py'
        var stream = fs.createWriteStream(path);
        stream.once('open', function(fd) {
            stream.write('import sys\n')
            stream.write('import smtplib, ssl\n')
            stream.write('port = 587\n')
            stream.write('smtp_server = "smtp.gmail.com"\n')
            stream.write('sender_email ='+'"'+answers['remitente']+'"'+'\n')
            stream.write('receiver_email = '+'"'+answers['destinatario']+'"'+'\n')
            stream.write('password ='+'"'+answers['password']+'"'+'\n')
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
        spinner.stop();
        
    })
}

function emailWithNode() {
    
}