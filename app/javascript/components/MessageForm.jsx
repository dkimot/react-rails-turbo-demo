import React, { useRef, useState } from "react";
import { useAction } from '../utility/hooks';

export default ({ authenticityToken, roomId }) => {
    const ref = useRef();

    const [msg, setMsg] = useState('');
    const handleMsgChange = (ev) => setMsg(ev.target.value);

    const reset = () => setMsg('');
    useAction(ref, 'turbo:submit-end', reset)

    return (
        <form ref={ref} action={`/rooms/${roomId}/messages`} method="post">
            <input type="hidden" name="authenticity_token" value={authenticityToken} />
            <div className="field">
                <input type="text" value={msg} onChange={handleMsgChange} name="message[content]" />
                <input type="submit" value="Send" />
            </div>
        </form>
    )
}
