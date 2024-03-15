class Chatbox 
{
    constructor()
    {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            Chatbox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.message = [];
    }

    display()
    {
        const {openButton, Chatbox, sendButton} = this.args;

        openButton.addEventListener('click', ()=> this.toggleState(Chatbox))

        sendButton.addEventListener('click', () => this.onSendButton(Chatbox))

        const node = Chatbox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(Chatbox)
            }
        })

    }

    toggleState(Chatbox) {
        this.state = !this.state;

        //command to either show or hide the box
        if(this.state) {
            Chatbox.classList.add('chatbox--active')
        } else {
            Chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(Chatbox) {
    var textField = Chatbox.querySelector('input');
    let text1 = textField.value
    if (text1 === "") {
        return;
    }

    let msg1 = { name: "User", message: text1 }
    this.message.push(msg1);

    // 'http://127.0.0.1:5000/predict'
    fetch($SCRIPT_ROOT + '/predict', {
        method: 'POST',
        body: JSON.stringify({message:text1}),
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(r => r.json())
    .then(r => {
        let msg2 = { name: "Gen Z", message: r.answer};
        this.message.push(msg2);
        this.updateChatText(Chatbox)
        textField.value = ''
        
    }).catch((error) => {
        console.error('Error:',error);
        this.updateChatText(Chatbox)
        textField.value = ''
    });

}

updateChatText(Chatbox) {
    var html = '';
    this.message.slice().reverse().forEach(function(item,){
        if (item.name === "Gen Z")
        {
            html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
        }
        else
        {
            html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
        }
    });

    const chatmessage = Chatbox.querySelector('.chatbox__messages');
    chatmessage.innerHTML = html;
}
}

const chatbox = new Chatbox();
chatbox.display();