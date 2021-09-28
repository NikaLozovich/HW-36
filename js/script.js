'use strict';

const todoController = {
    idToDo: 0,
    counter() {
        return this.idToDo++;
    },
    getData() {
        if(!todoModel.getData()) return false;
        return JSON.parse(todoModel.getData());
    },
    setData(inputs){
        const todoItemObject = this.handleInputs(inputs);
        todoModel.saveData(todoItemObject);
        return todoItemObject;
    },
    handleInputs(inputs) {
        const obj = {};
        for(const input of inputs) {
            obj[input.name] = input.value;
        }
        obj.completed = false;
        obj.id = this.idToDo;
        return obj;
    },
    delete(identity) {
        return this.getData().filter(obj => Number(obj.id) !== Number(identity));
    }
};

const todoModel = {
    dbName: 'saved_data',
    
    delete(e) {
        let identity = e.target.parentNode.id;
        document.getElementById(identity).parentNode.parentNode.removeChild(document.getElementById(identity).parentNode);
        this.newData(todoController.delete(identity) || null);
    },
    
    saveData(todoItem) {
        if(localStorage[this.dbName]) {
            const data = JSON.parse(localStorage[this.dbName]);
            data.push(todoItem);
            localStorage.setItem(this.dbName, JSON.stringify(data));
            return data;
        }
        const data = [todoItem];
        localStorage.setItem(this.dbName, JSON.stringify(data));
        return data;
    },
    getData() {
        if(!localStorage.getItem(this.dbName)) return false;
        return localStorage.getItem(this.dbName);
    },
    newData(newLocalData) {
        localStorage.setItem(this.dbName, JSON.stringify(newLocalData));
    },
    
};

const todoView = {
    form: document.querySelector('#todoForm'),
    itemClick: document.querySelector('#todoItems'),
    
    setEvents() {
        window.addEventListener('load', this.onLoadFunc.bind(this));
        this.form.addEventListener('submit', this.formSubmit.bind(this));
        
         this.itemClick.addEventListener('click', this.newData);
         this.itemClick.addEventListener('click', this.delete);
        
    },
    formSubmit(e) {
        e.preventDefault();
        const inputs = e.target.querySelectorAll('input, textarea');

        for(const input of inputs) {
            if(!input.value.length) return alert('No way you can add this shit');
        }

        const todoItemObject = todoController.setData(inputs);
        this.renderItem(todoItemObject);
        todoController.counter();
        e.target.reset();
    },
    onLoadFunc() {
        if (todoController.getData()){
        todoController.getData().forEach(item => {
            this.renderItem(item);
            todoController.idToDo = item.id + 1
        });
        }
    },
    createTemplate(titleText = '', descriptionText = '', completed, id) {
        const mainWrp = document.createElement('div');
        mainWrp.className = 'col-4';

        const wrp = document.createElement('div');
        wrp.className = 'taskWrapper';
        wrp.setAttribute('completed', false);
        wrp.id = id;
        mainWrp.append(wrp);

        const title = document.createElement('div');
        title.innerHTML = titleText;
        title.className = 'taskHeading';
        wrp.append(title);

        const description = document.createElement('div');
        description.innerHTML = descriptionText;
        description.className = 'taskDescription';
        wrp.append(description);

        const chkBox = document.createElement('input');
        chkBox.type = 'checkbox';
        chkBox.className = 'taskCheckbox';
        if (completed) chkBox.checked = true;
        wrp.append(chkBox);

        const delBtn = document.createElement('button');
        delBtn.type = 'button'
        delBtn.className = 'delBtn';
        delBtn.innerHTML = 'del';
        wrp.append(delBtn);

        return mainWrp;
    },
    renderItem({title, description, completed, id}) {
        const template = this.createTemplate(title, description, completed, id);
        this.itemClick.prepend(template);
    },
     newData(e) {
        let transfer = todoController.getData();
          for (let item of transfer) {
              if (e.target.classList.contains("taskCheckbox")) {
                if (item.id === Number(e.target.parentNode.id)) {
                    item.completed = e.target.checked;
                }
              }
              
          }

             todoModel.newData(transfer);
        
    },
     delete(e) {
        if (e.target.classList.contains("delBtn")) {
            todoModel.delete(e)
     }
    }
};

todoView.setEvents();