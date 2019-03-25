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
var extencion = '';
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
            mail(componente)
        }
        else if(comando === '-h' && args.length===1){
            console.log('USA emango generar [nombre] PARA CREAR UN COMPONENTE DE CORREO.')
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
            name: 'opcion',
            type: 'list',
            message: 'Eliga una opción:',
            choices: [{
                name: 'Python',
                value: '1'
            },
            {
                name: 'Node',
                value: '2'
            },
            {
                name: 'Ruby',
                value: '3'
            }
        ],
        }
    ]).then(answers => {
        switch (answers.opcion) {
            case '1':
                pythonMail(componente);
                extencion = '.py'
                break;
            case '2':
                nodeMail(componente);
                extencion = '.js'
                break;
            case '3':
                rubyMail(componente);
                extencion = '.rb'
                break;
            default:
                break;
        }
       
    })
}

function pythonMail(nombre){
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
        shell.exec('mkdir '+nombre+'-componente')
        var path = nombre + '-componente' +'/'+nombre+'.py'
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
        execPython(nombre)
        
    })
}

function execPython(nombre){
    inquirer.prompt([
        {
            name: 'ejecutar',
            message: '¿Desea ejecutarlo ahora?',
            type: 'list',
            choices: [
                {
                    name: 'Sí',
                    value: '1'
                },
                {
                    name: 'No',
                    value: '0'
                }
            ]
        }
    ]).then(answer => {
        switch (answer.ejecutar) {
            case '1':
                shell.exec('python3 '+nombre+'-componente/'+nombre+'.py');
                break;
            case '0':
                console.log(chalk.red('Para ejecutar:'));
                console.log('cd '+nombre+'-component');
                console.log('python3 '+nombre+'.py');
                break;
            default:
                break;
        }
    })
}

function nodeMail(nombre) {
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
    ]).then(answers => {
        spinner.start();
        console.log('Creating node file');
        shell.exec('mkdir '+ nombre + '-componente');
        var path = nombre+'-componente'+'/'+nombre+'.js';
        var stream = fs.createWriteStream(path);
        stream.once('open', function(fs){
            stream.write("var nodemailer = require('nodemailer')\n")
            stream.write('var transporter = nodemailer.createTransport({\n')
            stream.write("service: 'gmail',\n")
            stream.write('auth: { \n')
            stream.write('  user: '+'"'+answers['remitente']+'"'+',\n')
            stream.write('  pass: '+'"'+answers['password']+'"'+'\n')
            stream.write('}\n')
            stream.write('});\n')
            stream.write('var mailOptions = {\n')
            stream.write('  from: '+'"'+answers['remitente']+'"'+',\n')
            stream.write('  to: '+'"'+answers['destinatario']+'"'+',\n')
            stream.write('  subject: '+'"'+answers['asunto']+'"'+',\n')
            stream.write('  text: '+'"'+answers['cuerpo']+'"'+'\n')
            stream.write('};\n')
            stream.write('transporter.sendMail(mailOptions, function(error, info){\n')
            stream.write('  if(error) {\n')
            stream.write('      console.log(error);\n')
            stream.write('  }else {\n')
            stream.write("      console.log('Email sent: ' + info.response);\n")
            stream.write('  }\n')
            stream.write('});\n')
            stream.end()
        });
        console.log('Successfully created correo.js file.')
        spinner.stop();
        execNode(nombre)
    })
}

function execNode(nombre) {
    inquirer.prompt([
        {
            name: 'ejecutar',
            message: '¿Desea ejecutarlo ahora?',
            type: 'list',
            choices: [
                {
                    name: 'Sí',
                    value: '1'
                },
                {
                    name: 'No',
                    value: '0'
                }
            ]
        }
    ]).then(answer => {
        switch (answer.ejecutar) {
            case '1':
                shell.exec('node '+nombre+'-componente/'+nombre+'.js');
                break;
            case '0':
                console.log(chalk.red('Para ejecutar:'));
                console.log('cd '+nombre+'-component');
                console.log('node '+nombre+'.js');
                break;
            default:
                break;
        }
    })
}

function rubyMail(nombre){
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
    ]).then(answers => {
        spinner.start();
        console.log('Creating ruby file');
        shell.exec('mkdir '+ nombre + '-componente');
        var path = nombre+'-componente'+'/'+nombre+'.rb';
        var stream = fs.createWriteStream(path);
        stream.once('open', function(fs){

        });
    })
}