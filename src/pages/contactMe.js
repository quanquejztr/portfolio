import { useState } from "react"
const ContactMe = () => {

    const [showSendButton, setShowSendButton] = useState(false);
    const [senderInfo, setSenderInfo] = useState('');
    const [message, setMessage] = useState('');

    const recipientEmail = 'stephenluong24@gmail.com';

    const handleEmailFocus = () => {
        setShowSendButton(true);
    };

    const handleEmailBlur = () => {
        if (senderInfo === '' && message === '') {
            setShowSendButton(false);
        }
    };
    const handleSendMessage = () => {
        if (message.trim() === '' || senderInfo.trim() === '') {
            alert('Please write your thoughts and provide your name/email.');
            return;
        }

        // Construct the mailto link
        const subject = encodeURIComponent(`Message from your website by ${senderInfo}`);
        const body = encodeURIComponent(message);
        const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

        // Open the default email client
        window.location.href = mailtoLink;

        // Optionally, clear the form fields after sending
        setMessage('');
        setSenderInfo('');
        setShowSendButton(false); // Hide the button after sending
    };

    return(
    <>
        <div className="h-auto w-full flex flex-col items-center mb-5">
            <span className="text-white font-dm-sans text-xl">
                <span className="text-white hover:text-black text-6xl hover:bg-white font-archivo translate-x-full transition-colors duration-300 ">
                CONNECT WITH ME
                </span>
            </span>
        </div>
        <div id="ask" class="relative bg-[#F2F5F3] h-lvh sm:h-[40vh] w-full flex flex-col items-center rounded-lg shadow-2xl z-20 hover:translate-y-[-0.25rem] hover:translate-x-[-0.25rem] hover:shadow-3xl transition-all duration-500 ease-in-out">
            <div class="h-[90%] md:h-[45%] w-[90%] flex flex-col items-center mt-[3rem] mx-[2rem]">
                <div class="flex flex-row gap-[0.1rem] w-[80%] relative justify-center">
                    <div class="uppercase text-[0.7rem] font-roboto text-center">
                        
                        Have something on your mind? Write it down and send to me, I'll read it and reply asap
                    </div>
                </div>
                <textarea id="message" rows="4" class="bg-transparent p-2.5 w-[65%] h-[70%] text-[0.6rem] text-[#111] focus:outline-none text-center font-roboto tracking-[1px] resize-none " placeholder="Write your thoughts here and send it to me. I would love to hear your thoughts!"></textarea>
            </div>
            <textarea
                id="email"
                cols="24"
                rows="1"
                className="absolute bottom-[1rem] right-[1rem] w-[10rem] border border-[1px] border-[#111] border-opacity-20 p-2 text-[#111] text-[0.7rem] rounded-lg focus:outline-none text-center resize-none"
                placeholder="your name / email"
                value={senderInfo}
                onChange={(e) => setSenderInfo(e.target.value)}
                onFocus={handleEmailFocus}
                onBlur={handleEmailBlur}
            ></textarea>

            <button
                className={`absolute right-[1rem] w-[10rem] p-2 bg-darkBlue text-white border border-1px border-[#444444] text-[0.7rem] rounded-lg focus:outline-none text-center transition-all duration-300 ease-in-out transform
                    ${showSendButton ? 'bottom-[4rem] opacity-100' : 'bottom-[1rem] opacity-0 pointer-events-none'}
                `}
                type="button"
                onClick={handleSendMessage}
            >
                send to Cuong
            </button>
            </div>
    </>
    )
}

export default ContactMe