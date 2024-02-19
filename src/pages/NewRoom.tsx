import illustration from '../assents/illustration.svg';
import logoImg from '../assents/logo.svg';
import '../styles/auth.scss'
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getDatabase, push, ref } from 'firebase/database';


export function NewRoom(){
    const { user } = useAuth();
    const [ newRoom, setNewRoom] = useState('');
    const navigate = useNavigate();

    async function handleCreateRoom(event: FormEvent){

        event.preventDefault();

        if(newRoom.trim() === ''){
            return;
        }

        const roomRef = getDatabase();
        
        const roomsRef = ref(roomRef, 'rooms',)

        push(roomsRef,{
            title: newRoom,
            authorId: user?.id
        })

        navigate(`/rooms/${roomsRef.key}`)

    }

    return(
        <div id='page-auth'>
            <aside>
                <img src={illustration} alt="ilustusção simbolizando perguntas e respostas" />
                <strong>Crie salas de q&amp;A ao-vivo</strong>
                <p>Tire as duvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="letmeask" />
                    <h2>Crie uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text" 
                            placeholder='Digite o codigo da sala'
                            onChange={event=> setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala existente?<Link to="/">clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}