import { useState, useEffect } from 'react'
import PayPal from '../Paypal/PayPal'
import './BookingForm.css'

interface Props {
    selectedTime: string,
    handleSubmit: (firstName: string, lastName: string, telephone: string, email: string, address: string, medium: string, handle: string, mop: string, policy: string, auth: string, dob: string, privacy: boolean) => void
}

const BookingForm: React.FC<Props> = (props) => {
    const selectedDate = new Date(props.selectedTime).toString()

    //form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [address, setAddress] = useState('');
    const [medium, setMedium] = useState('');
    const [handle, setHandle] = useState('');
    const [mop, setMop] = useState('');
    const [dob, setDob] = useState('');
    const [policy, setPolicy] = useState('');
    const [auth, setAuth] = useState('');
    const [privacy, setPrivacy] = useState(false);

    const [googleLoad, setGoogleLoad] = useState<boolean>(false);
    const renderGoogle = () => {
        setGoogleLoad(true)
        let autocomplete: any;
        const google = window.google;
        const auto: any = document.getElementById('autocomplete');
        autocomplete = new google.maps.places.Autocomplete(auto, {})

        let handlePlaceSelect = () => {
            let addressObject = autocomplete.getPlace();
            let address = addressObject.address_components;

            autocomplete.setFields(['address_component']);
            let textAddress = '';
            address.map((part: any, i: number) => {
                textAddress += part['long_name']
                if (i < address.length - 1) {
                    textAddress += ', '
                }
                return '';
            })
            setAddress(textAddress)
        }
        autocomplete.addListener("place_changed", handlePlaceSelect)
    }

    useEffect(() => {
        if (googleLoad === false) {
            const script = document.createElement("script");
            script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAkuPHNHz8Ki1KV6n6iI1-EFVIC3ZAm0QY&libraries=places";
            script.async = true;
            script.onload = () => renderGoogle();
            document.body.appendChild(script);
        }
    })

    const formSub = (e: any) => {
        e.preventDefault()
        theSubmission()
    }

    const theSubmission = () => {
        props.handleSubmit(firstName, lastName, telephone, email, address, medium, handle, mop, policy, auth, dob, privacy)
    }

    return (
        <div className='bookingContainer'>
            <div className='atBanner'>
                <h2 style={{marginTop: '40px'}}>Appointment Booking Form</h2>
                <p>You have selected {selectedDate.split(':00 GMT')[0]}</p>
            </div>
            <hr className='hr' />

            <form 
                className='bookingForm' 
                onSubmit={(e: any) => formSub(e)}
                >
                <label>
                    <div className='bookingLabel'>First Name:</div> <div className='requiredIcon'>*</div>
                    <br />
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
                </label>
                <label>
                    <div className='bookingLabel'>Last Name:</div> <div className='requiredIcon'>*</div>
                    <br />
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
                </label>
                <label>
                    <div className='bookingLabel'>Telephone:</div> <div className='requiredIcon'>*</div>
                    <br />
                    <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Mobile Number" required />
                </label>
                <label>
                    <div className='bookingLabel'>Email:</div> <div className='requiredIcon'>*</div>
                    <br />
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. example@example.com" required />
                </label>
                <label>
                    <div className='bookingLabel'>Address:</div> <div className='requiredIcon'>*</div>
                    <br />
                    <input id="autocomplete" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your Home Address" required />
                </label>
                <label>
                    <div className='bookingLabel'>Medium:</div> <div className='requiredIcon'>*</div>
                    <br />
                    <select name="medium" value={medium} onChange={(e) => setMedium(e.target.value)}>
                        <option value={0}>-Select-</option>
                        <option value="skype">Skype</option>
                        <option value="google">Google Hangouts</option>
                        <option value="zoom">Zoom</option>
                        <option value="whatsapp">Whatsapp</option>
                        <option value="telephone">Telephone</option>
                    </select>
                </label>
                {
                    medium === 'whatsapp' || medium === 'telephone' || medium === '' || medium === '0' ?
                        <></> :
                            <label>
                                <div className='bookingLabel'>Handle:</div> <div className='requiredIcon'>*</div>
                                <br />
                                <input type="text" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder={medium.substr(0, 1).toUpperCase() + medium.slice(1).toLowerCase() + ' handle'} required />
                            </label>
                }
                <label>
                    <div className='bookingLabel'>Method of Payment:</div> <div className='requiredIcon'>*</div>
                    <br />
                    <select name="mop" value={mop} onChange={(e) => setMop(e.target.value)}>
                        <option value={0}>-Select-</option>
                        <option value="self-funding">Self-funding</option>
                        <option value="insurance">Private Insurance</option>
                    </select>
                </label>
                    {
                        mop === 'insurance' ? 
                        <>
                        <hr className="divider" />
                            <label>
                                <div className='bookingLabel'>Policy Number:</div>
                                <br />
                                <input type="text" value={policy} onChange={(e) => setPolicy(e.target.value)} placeholder="Also known as membership number" />
                            </label>
                            <label>
                                <div className='bookingLabel'>Authorisation:</div>
                                <br />
                                <input type="text" value={auth} onChange={(e) => setAuth(e.target.value)} placeholder="Issued by your insurance provider" />
                            </label>
                        <hr className="divider" />
                        </> :
                            mop === 'self-funding' &&
                                <>
                                <hr className="divider" />
                                    <div style={{fontSize: '14px'}}>
                                        We will collect the consultation fee of £100 when you submit this form
                                    </div>
                                <hr className="divider" />
                                </>
                    }
                <label>
                    <div className='bookingLabel'>Date of Birth:</div> <div className='requiredIcon'>*</div>
                    <br />
                    <input type="date" style={{WebkitAppearance: 'button'}} value={dob} onChange={(e) => setDob(e.target.value)} required />
                </label>
                <label>
                    <div className='bookingLabel'>Privacy:</div> <div className='requiredIcon'>*</div>
                    <br />
                    <div className="checkbox-alignment">
                        <input 
                            name="privacy" 
                            type="checkbox" 
                            style={{appearance: 'auto', WebkitAppearance: 'checkbox', width: '30px', border: '1px solid var(--the-black)', margin: '0 15px'}}
                            checked={privacy} 
                            onChange={() => setPrivacy(!privacy)} 
                            required 
                            />
                        <p>By ticking this box you indicate that you have read and agree with our<a href="https://www.londonfootandanklesurgery.co.uk/about-us/privacy-policy/" target="_blank" rel="noreferrer">&nbsp;Privacy Policy&nbsp;</a></p>
                    </div>
                </label>
                {
                    (mop === 'self-funding' && privacy) ? 
                        <div className="paypal-container">
                            <PayPal 
                                price={100}
                                description="Virtual Consultation with Mr. Kaser Nazir, Consultant Podiatric Surgeon."
                                paySubmit={() => theSubmission()}
                                />
                        </div> : 
                            <input className='submitButton' type="submit" value="Submit" />
                }
            </form>

        </div>
    )
}

export default BookingForm