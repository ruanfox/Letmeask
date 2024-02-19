import { useParams } from "react-router-dom"
import { FormEvent, useEffect, useState } from "react"

import { useAuth } from "../hooks/useAuth"
import { getDatabase, ref, get, push } from 'firebase/database';

import logoImg from "../assents/logo.svg"
import { Button } from "../components/Button"
import { RoomCode } from "../components/RoomCode"
import "../styles/room.scss"

type FirebaseQuestions = Record<string, {
    author:{
        name:string,
        avatar:string;
    }
    content:string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: string;
    author:{
        name:string,
        avatar:string;
    }
    content:string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

type RoomParams ={
    id: string;
}

export function Room(){
    const {user} = useAuth();
    const params = useParams<RoomParams>();
    const [newQuestion,setnewQuestoin]  = useState('')
    const [ questions, setQuestions] = useState<Question[]>([])
    const [ title, setTitle] = useState('')

    const roomId = params.id || ""

    useEffect( () => {
 
        const database = getDatabase();
        const roomRef = ref(database,`rooms/${roomId}`);
    
        get(roomRef).then((snapshot) => {
            const databaseRoom = snapshot.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
    
            const parsedQuestions: Question[] = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content:value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                }
            })
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
            
        })
    }, [roomId])


    async function handleSendQuention(event: FormEvent){
        event.preventDefault()
        if(newQuestion.trim() === ''){
           return;
        }

        if(!user){
            throw new Error('your must be logged in')
        }

        const question = {
            content:newQuestion,
            author:{
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false
        };

        const db = getDatabase();

        const questionsRef = ref(db,`rooms/${roomId}/questions`);
        push(questionsRef, question);

        setnewQuestoin('');
    }

    return(
            <div id="page-room">
                <header >
                    <div className="content">
                        <img src={logoImg} alt="Letmeask" />
                        <RoomCode code={roomId} />
                    </div>
                </header>
                <main>
                    <div className="room-title">
                        <h1>Sala {title}</h1>
                        { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                    </div>
                    <form onSubmit={handleSendQuention}>
                        <textarea 
                            placeholder="O que você quer perguntar?"
                            onChange={event => setnewQuestoin(event.target.value)}
                            value={newQuestion }
                        />
                        <div className="form-footer">
                            { user ? (
                                <div className="user-info">
                                    <img src={user.avatar} alt={user.name} />
                                    <span>{user.name}</span>
                                </div>
                            ) : (
                                <span>Para enviar uma pergunta <button className="button-login">faça seu login</button></span>
                            )} 
                            <Button type="submit" disabled={!user}> Enviar pergunta</Button>
                        </div>
                    </form>

                    {JSON.stringify(questions)}
                </main>
            </div>
        )
}