const Modal= {
    open(){      
        //toogle pesquisar           
        //abrir modal
        //adicionar a class active ao modal
        document
        .querySelector(".modal-overlay")
        .classList
        .add("active");
    },
    close(){                 
        //abrir modal
        //adicionar a class active ao modal
        /* const blocModal = document.getSelection(".modal-overlay")
        blocModal.style.color="#000000";*/
        document
        .querySelector(".modal-overlay")
        .classList
        .remove("active");
    }
 }
/*
function save(){
const fieldDescription = document.querySelector(".description").value;
const fieldExpanseve = document.querySelector(".expanseve").value;
const fieldIncome = document.querySelector(".income").value;
const fieldDate = doccument.querySelector(".date").value;

console.log(fieldExpanseve)
}   
*/
const Storage = {
    get(){
        //JSON.parse transforma de String para objeto ou array
       return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    // transformando um array para  string stringfy
    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}


const Transaction = {

    all:Storage.get(),
    
    add(transaction){
        Transaction.all.push(transaction)
        
        App.reload();
    },
    
    remove(index){
        Transaction.all.splice(index, 1)

        App.reload();

    },
    income(){
        //somar as entradas
        let income = 0;

        Transaction.all.forEach( transaction => {
            if(transaction.amount > 0 ){
                income += transaction.amount;
            }

        })
        return income
    },
    expense(){
        //somar as saidas
        let expense = 0;

        Transaction.all.forEach( transaction => {
            if(transaction.amount < 0 ){
                expense += transaction.amount;
            }
            
        })
        return expense
    },
    
    total(){
        //entradas - saidas
      let total = Transaction.income() + Transaction.expense()
      return total
    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),
    
    addTransaction(transaction,index){


        /*
        let index = transaction.length  
        
        console.log(transaction)
        console.log(index)
                
        for(let id = 0; index !=id ;id++ ){*/
            const tr = document.createElement('tr');
            tr.innerHTML = DOM.tableinnerHTMLTransaction(transaction)
            tr.dataset.index = index

            DOM.transactionsContainer.appendChild(tr);
          
        //}
    },
    

    tableinnerHTMLTransaction(transaction,index){

        const CSSclasses = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
                <td class="description">${transaction.description}</td>
                <td class="${CSSclasses}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td class="minus">
                   <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
                </td>
         `
        return html
    },  

    updateBalance(){
         
        
        
      document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.income())
      document.getElementById("expenseDisplay").innerHTML =Utils.formatCurrency(Transaction.expense())
      document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total())
 
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100;

        return value
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
        
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""
        
        value = String(value).replace(/\D/g,"")       
        
        value = Number(value) / 100
        
        value = value.toLocaleString("pt-BR", {
            style:"currency",
            currency:"BRL"

        })
                
        return signal+value;

    }
}

const Form = {
    //Verificar se todas as informações foram preenchidas
    //Formatar e Adicionar nas transações
    //salvar dados
    // apagar dados do formulario
    //modal feche
    //atualziar a aplicação

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    
    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    
    validateFields(){
        const {description, amount, date} = Form.getValues();

        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos")
        }
        else{

        }
    },

    formatValues(){
        
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {

            description,
            amount,
            date
        }
        
    },
    saveTransaction(transaction){
        Transaction.add(transaction)
    },
   
    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""

    },

    submit(event){
        event.preventDefault()

        try{
            //validate
            Form.validateFields();
            //format
            const transaction = Form.formatValues()
             //salvar
            Form.saveTransaction(transaction);
            Form.clearFields();
            Modal.close();
            
        }catch(error){
            alert(error.message)
        }

    }
}



const App = {
    init(){
        Transaction.all.forEach((transaction, index) => DOM.addTransaction(transaction));

        DOM.updateBalance(); 

        Storage.set(Transaction.all)

    },
    reload(){
        DOM.clearTransactions()
        App.init()
    }
}

App.init()


