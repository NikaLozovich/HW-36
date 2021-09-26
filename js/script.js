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
    remove(identity){
        return this.getData().filter(obj => Number.parseInt(obj.id) !== Number.parseInt(identity));
    },
    removeAll(){
        todoModel.removeAll();
    }
};

const todoModel = {
    dbName: 'saved_data',
    remove(e) {
        let identity = e.target.parentNode.id;
        document.getElementById(identity).parentNode.parentNode.removeChild(document.getElementById(identity).parentNode);
        this.replaceData(todoController.remove(identity) || null);
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
    replaceData(newTodoArray) {
        localStorage.setItem(this.dbName, JSON.stringify(newTodoArray));
    },
    removeAll(){
        localStorage.clear();
        location.reload();
    }
};

const todoView = {
    form: document.querySelector('#todoForm'),
    itemClick: document.querySelector('#todoItems'),
    clearBtn: document.querySelector('#clear'),
    setEvents() {
        window.addEventListener('load', this.onLoadFunc.bind(this));
        this.form.addEventListener('submit', this.formSubmit.bind(this));
        this.itemClick.addEventListener('click', this.taskPrfeormed);
        this.itemClick.addEventListener('click', this.remove);
        this.clearBtn.addEventListener('click', this.removeAll);
    },
    formSubmit(e) {
        e.preventDefault();
        const inputs = e.target.querySelectorAll('input, textarea');

        for(const input of inputs) {
            if(!input.value.length) return alert('No way you can add this shit');
        }

        const todoItemObject = todoController.setData(inputs);
        this.renderItem(todoItemObject);
        e.target.reset();
    },
    onLoadFunc() {
        if (todoController.getData()){
        todoController.getData().forEach(item => {
            this.renderItem(item);
        });
        }
    },
    createTemplate(titleText = '', descriptionText = '', id = todoController.counter()) {
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
        wrp.append(chkBox);

        const remove = document.createElement('button');
        remove.type = 'button'
        remove.className = 'delBtn';
        remove.innerHTML = 'del';
        wrp.append(remove);

        return mainWrp;
    },
    renderItem({title, description, completed, id}) {
        const template = this.createTemplate(title, description, id);
        template.getElementsByClassName('taskCheckbox')[0].checked = completed || false;
        document.querySelector('#todoItems').prepend(template);
    },
    taskPrfeormed(e) {
        if (e.target.classList.contains("taskCheckbox")) {
            
            let convertedItems = todoController.getData()?.map(item => {
                if (item.id === Number(e.target.parentNode.id)){
                    item.completed = !item.completed;
                }
                return item;
            });
            todoModel.replaceData(convertedItems);
        }
    },
    remove(e) {
        if (e.target.classList.contains("delBtn")) {
            todoModel.remove(e);
        }
    },
    removeAll() {
        todoController.removeAll();
    }
};

todoView.setEvents();