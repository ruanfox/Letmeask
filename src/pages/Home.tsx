import { useNavigate } from 'react-router-dom';
import illustration from '../assents/illustration.svg';
import logoImg from '../assents/logo.svg';
import googleIconTag from '../assents/google-icon.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';



export function Home(){
    const navigate = useNavigate();
    const { user, signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user){
            await signInWithGoogle()
        }
        navigate('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if(roomCode.trim() === ''){
            return
        }

        const database = getDatabase();
        const roomRef = ref(database, `rooms/${roomCode}`);

        const roomsRef = await get(roomRef);

        if (!roomsRef.exists()) {
            alert('Room does not exist.');
            return;
        }
        navigate(`/rooms/${roomCode}`)
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
                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIconTag} alt="" />
                        Crie sua sala com o Google
                    </button>
                    <div className='separator' >ou entre em uma sala</div>
                    <form onClick={handleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder='Digite o codigo da sala'
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}