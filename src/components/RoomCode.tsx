import copyImg from "../assents/copy.svg";
import "../styles/room-code.scss";

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code);
    }

    return (
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                {/* Corrija aqui para usar a variável correta */}
                <img src={copyImg} alt='copy room code' />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    );
}
