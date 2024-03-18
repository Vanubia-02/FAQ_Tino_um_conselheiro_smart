'use strict';

//BLOCO - CONEXÃO COM FIREBASE
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

//BLOCO - CONEXÃO COM FIREBASE

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

//BLOCO - CONEXÃO COM FIREBASE

process.env.DEBUG = 'dialogflow:debug'; 
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
const agent = new WebhookClient({ request, response });
console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
console.log('Dialogflow Request body: ' + JSON.stringify(request.body));


//CADASTRA O EMAIL
function Addemail(agent) {
  const registerEmail = agent.parameters.AddEmail;

  return db.collection('Emails')
    .where('email', '==', registerEmail)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        console.log(`E-mail ${registerEmail} já cadastrado.`);
        agent.add(`⚠️E-mail ${registerEmail} já cadastrado.\n\n 📌Opções:\n\n 📝| Para adicionar um e-mail, digite "adicionar e-mail"\n\n ✅| Para listar os e-mails, digite "listar e-mails"\n\n 🗑️| Para deletar um e-mail, digite "deletar e-mail" \n\🛑| Para sair digite "Sair"`);
       
      } else {
            return db.collection('Emails').add({
            email: registerEmail,
          })
          .then(() => {
            console.log(`E-mail ${registerEmail} adicionado com sucesso à coleção "emails"!`);
            agent.add(`📩 E-mail ${registerEmail} adicionado com sucesso!\n\n 📌Opções:\n\n 📝| Para adicionar um e-mail, digite "adicionar e-mail"\n\n ✅| Para listar os e-mails, digite "listar e-mails"\n\n 🗑️| Para deletar um e-mail, digite "deletar e-mail" \n\🛑| Para sair digite "Sair"`);
           
          })
          .catch((error) => {
            console.error('Erro ao adicionar e-mail:', error);
            agent.add('⚠️Desculpe, houve um erro ao adicionar o e-mail. Por favor, tente novamente.\n\n 📌Opções:\n\n 📝| Para adicionar um e-mail, digite "adicionar e-mail"\n\n ✅| Para listar os e-mails, digite "listar e-mails"\n\n 🗑️| Para deletar um e-mail, digite "deletar e-mail" \n\n🛑| Para sair digite "Sair"');
          });
      }
    })
    .catch((error) => {
      console.error('Erro ao verificar e-mail:', error);
      agent.add('⚠️Desculpe, houve um erro ao verificar o e-mail. Por favor, tente novamente. \n\n 📌Opções:\n\n 📝| Para adicionar um e-mail, digite "adicionar e-mail"\n\n ✅| Para listar os e-mails, digite "listar e-mails"\n\n 🗑️| Para deletar um e-mail, digite "deletar e-mail" \n\n🛑| Para sair digite "Sair"');
    });
}
  
//CADASTRA O EMAIL
  

//LISTAR EMAILS
  function Listemails(agent){
    
  return db.collection('Emails')
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        agent.add('🔍Nenhum e-mail encontrado na coleção. \n\n📌Opções:\n\n 📝| Para adicionar um e-mail, digite "adicionar e-mail"\n\n ✅| Para listar os e-mails, digite "listar e-mails"\n\n 🗑️| Para deletar um e-mail, digite "deletar e-mail" \n\n🛑| Para sair digite "Sair"');
      } else {
         const listEmails = snapshot.docs.map(doc => doc.data().email);
        const formattedTable = listEmails.map(email => `✔️ ${email} `).join('\n');
        
        console.log('Tabela de e-mails:\n', formattedTable);
        agent.add(`📑Lista de e-mails:\n\n${formattedTable}\n\n 📌Opções:\n\n 📝| Para adicionar um e-mail, digite "adicionar e-mail"\n\n ✅| Para listar os e-mails, digite "listar e-mails"\n\n 🗑️| Para deletar um e-mail, digite "deletar e-mail" \n\n🛑| Para sair digite "Sair"`);
        
      }
    })
    .catch(error => {
      console.error('Erro ao listar e-mails:', error);
      agent.add('⚠️Desculpe, houve um erro ao listar os e-mails. Por favor, tente novamente. \n\n 📌Opções:\n\n 📝| Para adicionar um e-mail, digite "adicionar e-mail"\n\n ✅| Para listar os e-mails, digite "listar e-mails"\n\n 🗑️| Para deletar um e-mail, digite "deletar e-mail" \n\n🛑| Para sair digite "Sair"');
    });
  }

//LISTAR EMAILS
  

//DELETAR EMAIL
function Deleteemail(agent) {
  const emailDelete = agent.parameters.DeleteEmail;

  // Verificar se o e-mail a ser excluído é "clae@guanambi.ibaiano.edu.br"
  if (emailDelete === "clae@guanambi.ifbaiano.edu.br") {
    return agent.add('🚫Você não pode excluir o e-mail "clae@guanambi.ifbaiano.edu.br".\n Este e-mail é majoritário. \n\n 📌Opções:\n\n 📝| Para adicionar um e-mail, digite "adicionar e-mail"\n\n ✅| Para listar os e-mails, digite "listar e-mails"\n\n 🗑️| Para deletar um e-mail, digite "deletar e-mail" \n\n🛑| Para sair digite "Sair"');
  }

  return db.collection('Emails')
    .where('email', '==', emailDelete)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        return db.collection('Emails').doc(docId).delete();
      } else {
        agent.add(`⚠️E-mail "${emailDelete}" não encontrado na coleção. \n\n 📌Opções:\n\n 📝| Para adicionar um e-mail, digite "adicionar e-mail"\n\n ✅| Para listar os e-mails, digite "listar e-mails"\n\n 🗑️| Para deletar um e-mail, digite "deletar e-mail" \n\n🛑| Para sair digite "Sair"`);
      }
    })
    .then(() => {
      agent.add(`🗑️E-mail "${emailDelete}" excluído com sucesso. \n\n 📌Opções:\n\n 📝| Para adicionar um e-mail, digite "adicionar e-mail"\n\n ✅| Para listar os e-mails, digite "listar e-mails"\n\n 🗑️| Para deletar um e-mail, digite "deletar e-mail" \n\n🛑| Para sair digite "Sair"`);
    })
    .catch(error => {
      agent.add('⚠️Desculpe, houve um erro ao excluir o e-mail. Por favor, tente novamente. \n\n 📌Opções:\n\n 📝| Para adicionar um e-mail, digite "adicionar e-mail"\n\n ✅| Para listar os e-mails, digite "listar e-mails"\n\n 🗑️| Para deletar um e-mail, digite "deletar e-mail" \n\n🛑| Para sair digite "Sair"');
    });
}
//DELETAR EMAIL
  
  
//BLOCO DE DADOS PESSOAIS DOS ALUNOS
  
  function Datastudants(agent) {
    const nameStudant = agent.parameters.name;
    const classStudant = agent.parameters.class;
    const ageStudant = agent.parameters.age;
    
   const nameString = (nameStudant && typeof nameStudant === 'object') ? nameStudant.name : nameStudant;

    // Obter data e hora atuais
   const dateCurrentTime = new Date();
    const options = {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
    };
    const dateTimeFormatted = dateCurrentTime.toLocaleString('en-US', options);

    const dataStudant = {
      Name: nameString,
      Class: classStudant,
      Age: ageStudant,
      DateTime: dateTimeFormatted,
	  Criterion: {
        TAG: {
            CriterioA: {
                A1: {
                    // questões de A1
                },
                A2: {
                    // questões de A2
                },
            },
            CriterioB: {
                // questões de B
            },
            CriterioC: {
                // questões de C
            },
            CriterioD: {
                // questões de D
            },
            CriterioE: {
                // questões de E
            },
            CriterioF: {
                // questões de F
            },
        }
    }

    };
       
    return db.collection('Users').add(dataStudant)
        .then((user) => {
            const idUser = user.id;
      		agent.add(`🤖 ${nameString}, escolha uma das opções sobre atendimento psicológico do Campus Guanambi: \n\n01➡️ Atendimento pelo NAPNE \n02➡️ Atendimento pelo NAPSI \n03➡️ Atendimento pelo PRO-SAÚDE \n04➡️ Atendimento pelo PAE `);
      		agent.context.set({ name: 'context', lifespan: 50, parameters: { idUser: idUser } });
            return idUser;
        })
        .catch((error) => {
            console.log(`Erro ao registrar os dados: ${error}`);
            throw error;
        });
  }
  
//BLOCO DE QUESTÕES TAG
  
  function saveInBd(id, criterion, answerValue, answerKey = null,  questionVersion = null){
  const documentUser =  db.collection('Users').doc(id);
  let currentDate = {};

  return documentUser
    .get()
    .then((doc) => {
      if (doc.exists) {
        currentDate = doc.data();
        if(questionVersion){
          
          currentDate.Criterion.TAG[criterion][questionVersion][answerKey] = answerValue;
        }
        else{
			//As demais questões 
          currentDate.Criterion.TAG[criterion][answerKey] = answerValue;
        }

        return documentUser.update(currentDate);
      } else {
        console.log('Documento não encontrado!');
        return Promise.reject(new Error('Documento não encontrado!'));
      }
    })
    .then(() => {
      console.log('Documento atualizado com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao atualizar documento:', error);
    });
}
  

//--------------------------------- CRITÉRIOS --------------------------------
 
//critério A1 versão 1
  function QuestionTAG1av1(agent, idUser) {
      const answertag1AV1 = agent.parameters.Question1AV1;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
     
     return saveInBd(id, 'CriterioA', answertag1AV1, 'ResponseA1V1',  'A1');
}    

//critério F1 versão 2 - resposta egativa
  function Question1fv2_no(agent, idUser){
      //const answertag1FV2no = agent.parameters.Question1FV2no;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
      return saveInBd(id, 'CriterioF', 'Não', 'ResponseFV2');
  }

//critério F1 versão 2 - resposta egativa
  function Question1fv2_yes(agent, idUser){
      const answertag1FV2yes = agent.parameters.Question1FV2yes;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
    
      return saveInBd(id, 'CriterioF', answertag1FV2yes, 'ResponseFV2');
  }

//critério A2 versão 1
  function QuestionTAG2av1(agent,idUser){
    
      const answertag2AV1 = agent.parameters.Question2AV1;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
      return saveInBd(id, 'CriterioA', answertag2AV1, 'ResponseA2V1',  'A2');
  }

//critério B1 versão 1 
  function QuestionTAG1bv1(agent, idUser){
     const answertag1BV1 = agent.parameters.Question1BV1;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
      return saveInBd(id, 'CriterioB', answertag1BV1, 'ResponseBV1');
  }
 
//critério A1 Vesrão 3 
  function QuestionTAG1av3(agent, idUser){
      const answertag1AV3 = agent.parameters.Question1AV3;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
      return saveInBd(id, 'CriterioA', answertag1AV3, 'ResponseA1V3',  'A1');
  }

//critério D1 versão 1
  function QuestionTAG1dv1(agent, idUser){
      const answertag1DV1 = agent.parameters.Question1DV1;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;   
      return saveInBd(id, 'CriterioD', answertag1DV1, 'ResponseDV1');    
  }

//critério D1 versão 2
  function QuestionTAG1dv2(agent, idUser){
      const answertag1DV2 = agent.parameters.Question1DV2;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;    
      return saveInBd(id, 'CriterioD', answertag1DV2, 'ResponseDV2');
  } 

//critério C1 versão 2
  function QuestionTAG1cv2(agent, idUser){
      const answertag1CV2 = agent.parameters.Question1CV2;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;   
      return saveInBd(id, 'CriterioC', answertag1CV2, 'ResponseCV2');
  }

//critério B1 versão 2
  function QuestionTAG1bv2(agent, idUser){
      const answertag1BV2 = agent.parameters.Question1BV2;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
      return saveInBd(id, 'CriterioB', answertag1BV2, 'ResponseBV2');
  }

 //critério E1 versão 1
  function QuestionTAG1ev1(agent, idUser){
      const answertag1EV1 = agent.parameters.Question1EV1;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
      return saveInBd(id, 'CriterioE', answertag1EV1, 'ResponseEV1');
  }

//critério A1 versão 2
  function QuestionTAG1av2(agent, idUser){
      const answertag1AV2 = agent.parameters.Question1AV2;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
      return saveInBd(id, 'CriterioA', answertag1AV2, 'ResponseA1V2', 'A1');
  }

//critério A2 versão 2
  function QuestionTAG2av2(agent, idUser){
      const answertag2AV2 = agent.parameters.Question2AV2;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
      return saveInBd(id, 'CriterioA', answertag2AV2, 'ResponseA2V2',  'A2');
  }

//critério E1 versão 2  
  function QuestionTAG1ev2(agent, idUser){
      const answertag1EV2 = agent.parameters.Question1EV2;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
      return saveInBd(id, 'CriterioE', answertag1EV2, 'ResponseEV2');
  }

 //critério C1 versão 1 
  function QuestionTAG1cv1(agent, idUser){
      const answertag1CV1= agent.parameters.Question1CV1;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
      return saveInBd(id, 'CriterioC', answertag1CV1, 'ResponseCV1');
  }

//critério F1 versão 1 - resposta positiva 
  function QuestionTAG1fv1_yes(agent, idUser){
      const answertag1FV1yes = agent.parameters.Question1FV1yes;
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
      return saveInBd(id, 'CriterioF', answertag1FV1yes, 'ResponseFV1');
  }

//critério F1 versão 1 - resposta negativa 
  function QuestionTAG1fv1_no(agent, idUser){
    
      const context = agent.context.get('context');
      const id = context.parameters.idUser;
      return saveInBd(id, 'CriterioF', 'Não', 'ResponseFV1');
  }

//--------------------------------- CRITÉRIOS --------------------------------
 
 

//Mapeamento das Intenções
 
 let intentMap = new Map(); 
 
 intentMap.set('welcome', Datastudants);
 intentMap.set('login.add.email', Addemail);
 intentMap.set('login.list.emails',Listemails);
 intentMap.set('login.delete.emails',Deleteemail);
 intentMap.set('option1.option1',QuestionTAG1av1);
 intentMap.set('option1.option2 - no',Question1fv2_no);
 intentMap.set('option1.option2 - yes', Question1fv2_yes);
 intentMap.set('option1.option3',QuestionTAG2av1);
 intentMap.set('option2.option1',QuestionTAG1bv1);
 intentMap.set('option2.option2',QuestionTAG1av3);
 intentMap.set('option2.option3',QuestionTAG1dv1);
 intentMap.set('option2.option4',QuestionTAG1dv2);
 intentMap.set('option3.option1',QuestionTAG1cv2);
 intentMap.set('option3.option2',QuestionTAG1bv2);
 intentMap.set('option3.option3',QuestionTAG1ev1);
 intentMap.set('option4.option1',QuestionTAG1av2); 
 intentMap.set('option4.option2',QuestionTAG2av2);
 intentMap.set('option4.option3',QuestionTAG1ev2);
 intentMap.set('option4.option4',QuestionTAG1cv1);
 intentMap.set('option4.option5 - yes',QuestionTAG1fv1_yes);
 intentMap.set('option4.option5 - no',QuestionTAG1fv1_no);

 agent.handleRequest(intentMap);
});