import { CaretDown, Globe } from '@phosphor-icons/react'
import React, { useState } from 'react'

export default function SelectInput() {
    const [selectedOption, setSelectedOption] = useState('');
    const [isOptionSelected, setIsOptionSelected] = useState(false);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    }

    return (
        <div>
            <label className='mb-3 block text-black dark:text-white'>
                Select Country
            </label>

            <div className='relative z-20 bg-white dark:bg-form-input'>
                <span className='absolute top-1/2 left-4 -translate-y-1/2'>
                    <Globe size={20} />
                </span>

                <select value={selectedOption} onChange={(e) => {
                    setSelectedOption(e.target.value);
                    changeTextColor();
                }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3  outline-none transition  focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? 'text-black dark:text-white' : ''}`}>
                    <option value='' disabled className='text-body dark:text-bodydark'>Select Country</option>
                    <option value='Afghanistan' className='text-body dark:text-bodydark'>Afghanistan</option>
                    <option value='Albania' className='text-body dark:text-bodydark'>Albania</option>
                    <option value='Algeria' className='text-body dark:text-bodydark'>Algeria</option>
                    <option value='Andorra' className='text-body dark:text-bodydark'>Andorra</option>
                    <option value='Angola' className='text-body dark:text-bodydark'>Angola</option>
                    <option value='Antigua and Barbuda' className='text-body dark:text-bodydark'>Antigua and Barbuda</option>
                    <option value='Argentina' className='text-body dark:text-bodydark'>Argentina</option>
                    <option value='Armenia' className='text-body dark:text-bodydark'>Armenia</option>
                    <option value='Australia' className='text-body dark:text-bodydark'>Australia</option>
                    <option value='Austria' className='text-body dark:text-bodydark'>Austria</option>
                    <option value='Azerbaijan' className='text-body dark:text-bodydark'>Azerbaijan</option>
                    <option value='Bahamas' className='text-body dark:text-bodydark'>Bahamas</option>
                    <option value='Bahrain' className='text-body dark:text-bodydark'>Bahrain</option>
                    <option value='Bangladesh' className='text-body dark:text-bodydark'>Bangladesh</option>
                    <option value='Barbados' className='text-body dark:text-bodydark'>Barbados</option>
                    <option value='Belarus' className='text-body dark:text-bodydark'>Belarus</option>
                    <option value='Belgium' className='text-body dark:text-bodydark'>Belgium</option>
                    <option value='Belize' className='text-body dark:text-bodydark'>Belize</option>
                    <option value='Benin' className='text-body dark:text-bodydark'>Benin</option>
                    <option value='Bhutan' className='text-body dark:text-bodydark'>Bhutan</option>
                    <option value='Bolivia' className='text-body dark:text-bodydark'>Bolivia</option>
                    <option value='Bosnia and Herzegovina' className='text-body dark:text-bodydark'>Bosnia and Herzegovina</option>
                    <option value='Botswana' className='text-body dark:text-bodydark'>Botswana</option>
                    <option value='Brazil' className='text-body dark:text-bodydark'>Brazil</option>
                    <option value='Brunei' className='text-body dark:text-bodydark'>Brunei</option>
                    <option value='Bulgaria' className='text-body dark:text-bodydark'>Bulgaria</option>
                    <option value='Burkina Faso' className='text-body dark:text-bodydark'>Burkina Faso</option>
                    <option value='Burundi' className='text-body dark:text-bodydark'>Burundi</option>
                    <option value='Cabo Verde' className='text-body dark:text-bodydark'>Cabo Verde</option>
                    <option value='Cambodia' className='text-body dark:text-bodydark'>Cambodia</option>
                    <option value='Cameroon' className='text-body dark:text-bodydark'>Cameroon</option>
                    <option value='Canada' className='text-body dark:text-bodydark'>Canada</option>
                    <option value='Central African Republic' className='text-body dark:text-bodydark'>Central African Republic</option>
                    <option value='Chad' className='text-body dark:text-bodydark'>Chad</option>
                    <option value='Chile' className='text-body dark:text-bodydark'>Chile</option>
                    <option value='China' className='text-body dark:text-bodydark'>China</option>
                    <option value='Colombia' className='text-body dark:text-bodydark'>Colombia</option>
                    <option value='Comoros' className='text-body dark:text-bodydark'>Comoros</option>
                    <option value='Congo (Congo-Brazzaville)' className='text-body dark:text-bodydark'>Congo (Congo-Brazzaville)</option>
                    <option value='Congo (DRC)' className='text-body dark:text-bodydark'>Congo (DRC)</option>
                    <option value='Costa Rica' className='text-body dark:text-bodydark'>Costa Rica</option>
                    <option value='Croatia' className='text-body dark:text-bodydark'>Croatia</option>
                    <option value='Cuba' className='text-body dark:text-bodydark'>Cuba</option>
                    <option value='Cyprus' className='text-body dark:text-bodydark'>Cyprus</option>
                    <option value='Czech Republic' className='text-body dark:text-bodydark'>Czech Republic</option>
                    <option value='Denmark' className='text-body dark:text-bodydark'>Denmark</option>
                    <option value='Djibouti' className='text-body dark:text-bodydark'>Djibouti</option>
                    <option value='Dominica' className='text-body dark:text-bodydark'>Dominica</option>
                    <option value='Dominican Republic' className='text-body dark:text-bodydark'>Dominican Republic</option>
                    <option value='Ecuador' className='text-body dark:text-bodydark'>Ecuador</option>
                    <option value='Egypt' className='text-body dark:text-bodydark'>Egypt</option>
                    <option value='El Salvador' className='text-body dark:text-bodydark'>El Salvador</option>
                    <option value='Equatorial Guinea' className='text-body dark:text-bodydark'>Equatorial Guinea</option>
                    <option value='Eritrea' className='text-body dark:text-bodydark'>Eritrea</option>
                    <option value='Estonia' className='text-body dark:text-bodydark'>Estonia</option>
                    <option value='Eswatini' className='text-body dark:text-bodydark'>Eswatini</option>
                    <option value='Ethiopia' className='text-body dark:text-bodydark'>Ethiopia</option>
                    <option value='Fiji' className='text-body dark:text-bodydark'>Fiji</option>
                    <option value='Finland' className='text-body dark:text-bodydark'>Finland</option>
                    <option value='France' className='text-body dark:text-bodydark'>France</option>
                    <option value='Gabon' className='text-body dark:text-bodydark'>Gabon</option>
                    <option value='Gambia' className='text-body dark:text-bodydark'>Gambia</option>
                    <option value='Georgia' className='text-body dark:text-bodydark'>Georgia</option>
                    <option value='Germany' className='text-body dark:text-bodydark'>Germany</option>
                    <option value='Ghana' className='text-body dark:text-bodydark'>Ghana</option>
                    <option value='Greece' className='text-body dark:text-bodydark'>Greece</option>
                    <option value='Grenada' className='text-body dark:text-bodydark'>Grenada</option>
                    <option value='Guatemala' className='text-body dark:text-bodydark'>Guatemala</option>
                    <option value='Guinea' className='text-body dark:text-bodydark'>Guinea</option>
                    <option value='Guinea-Bissau' className='text-body dark:text-bodydark'>Guinea-Bissau</option>
                    <option value='Guyana' className='text-body dark:text-bodydark'>Guyana</option>
                    <option value='Haiti' className='text-body dark:text-bodydark'>Haiti</option>
                    <option value='Honduras' className='text-body dark:text-bodydark'>Honduras</option>
                    <option value='Hungary' className='text-body dark:text-bodydark'>Hungary</option>
                    <option value='Iceland' className='text-body dark:text-bodydark'>Iceland</option>
                    <option value='India' className='text-body dark:text-bodydark'>India</option>
                    <option value='Indonesia' className='text-body dark:text-bodydark'>Indonesia</option>
                    <option value='Iran' className='text-body dark:text-bodydark'>Iran</option>
                    <option value='Iraq' className='text-body dark:text-bodydark'>Iraq</option>
                    <option value='Ireland' className='text-body dark:text-bodydark'>Ireland</option>
                    <option value='Israel' className='text-body dark:text-bodydark'>Israel</option>
                    <option value='Italy' className='text-body dark:text-bodydark'>Italy</option>
                    <option value='Jamaica' className='text-body dark:text-bodydark'>Jamaica</option>
                    <option value='Japan' className='text-body dark:text-bodydark'>Japan</option>
                    <option value='Jordan' className='text-body dark:text-bodydark'>Jordan</option>
                    <option value='Kazakhstan' className='text-body dark:text-bodydark'>Kazakhstan</option>
                    <option value='Kenya' className='text-body dark:text-bodydark'>Kenya</option>
                    <option value='Kiribati' className='text-body dark:text-bodydark'>Kiribati</option>
                    <option value='Korea (North)' className='text-body dark:text-bodydark'>Korea (North)</option>
                    <option value='Korea (South)' className='text-body dark:text-bodydark'>Korea (South)</option>
                    <option value='Kuwait' className='text-body dark:text-bodydark'>Kuwait</option>
                    <option value='Kyrgyzstan' className='text-body dark:text-bodydark'>Kyrgyzstan</option>
                    <option value='Laos' className='text-body dark:text-bodydark'>Laos</option>
                    <option value='Latvia' className='text-body dark:text-bodydark'>Latvia</option>
                    <option value='Lebanon' className='text-body dark:text-bodydark'>Lebanon</option>
                    <option value='Lesotho' className='text-body dark:text-bodydark'>Lesotho</option>
                    <option value='Liberia' className='text-body dark:text-bodydark'>Liberia</option>
                    <option value='Libya' className='text-body dark:text-bodydark'>Libya</option>
                    <option value='Liechtenstein' className='text-body dark:text-bodydark'>Liechtenstein</option>
                    <option value='Lithuania' className='text-body dark:text-bodydark'>Lithuania</option>
                    <option value='Luxembourg' className='text-body dark:text-bodydark'>Luxembourg</option>
                    <option value='Madagascar' className='text-body dark:text-bodydark'>Madagascar</option>
                    <option value='Malawi' className='text-body dark:text-bodydark'>Malawi</option>
                    <option value='Malaysia' className='text-body dark:text-bodydark'>Malaysia</option>
                    <option value='Maldives' className='text-body dark:text-bodydark'>Maldives</option>
                    <option value='Mali' className='text-body dark:text-bodydark'>Mali</option>
                    <option value='Malta' className='text-body dark:text-bodydark'>Malta</option>
                    <option value='Marshall Islands' className='text-body dark:text-bodydark'>Marshall Islands</option>
                    <option value='Mauritania' className='text-body dark:text-bodydark'>Mauritania</option>
                    <option value='Mauritius' className='text-body dark:text-bodydark'>Mauritius</option>
                    <option value='Mexico' className='text-body dark:text-bodydark'>Mexico</option>
                    <option value='Micronesia' className='text-body dark:text-bodydark'>Micronesia</option>
                    <option value='Moldova' className='text-body dark:text-bodydark'>Moldova</option>
                    <option value='Monaco' className='text-body dark:text-bodydark'>Monaco</option>
                    <option value='Mongolia' className='text-body dark:text-bodydark'>Mongolia</option>
                    <option value='Montenegro' className='text-body dark:text-bodydark'>Montenegro</option>
                    <option value='Morocco' className='text-body dark:text-bodydark'>Morocco</option>
                    <option value='Mozambique' className='text-body dark:text-bodydark'>Mozambique</option>
                    <option value='Myanmar (Burma)' className='text-body dark:text-bodydark'>Myanmar (Burma)</option>
                    <option value='Namibia' className='text-body dark:text-bodydark'>Namibia</option>
                    <option value='Nauru' className='text-body dark:text-bodydark'>Nauru</option>
                    <option value='Nepal' className='text-body dark:text-bodydark'>Nepal</option>
                    <option value='Netherlands' className='text-body dark:text-bodydark'>Netherlands</option>
                    <option value='New Zealand' className='text-body dark:text-bodydark'>New Zealand</option>
                    <option value='Nicaragua' className='text-body dark:text-bodydark'>Nicaragua</option>
                    <option value='Niger' className='text-body dark:text-bodydark'>Niger</option>
                    <option value='Nigeria' className='text-body dark:text-bodydark'>Nigeria</option>
                    <option value='North Macedonia' className='text-body dark:text-bodydark'>North Macedonia</option>
                    <option value='Norway' className='text-body dark:text-bodydark'>Norway</option>
                    <option value='Oman' className='text-body dark:text-bodydark'>Oman</option>
                    <option value='Pakistan' className='text-body dark:text-bodydark'>Pakistan</option>
                    <option value='Palau' className='text-body dark:text-bodydark'>Palau</option>
                    <option value='Panama' className='text-body dark:text-bodydark'>Panama</option>
                    <option value='Papua New Guinea' className='text-body dark:text-bodydark'>Papua New Guinea</option>
                    <option value='Paraguay' className='text-body dark:text-bodydark'>Paraguay</option>
                    <option value='Peru' className='text-body dark:text-bodydark'>Peru</option>
                    <option value='Philippines' className='text-body dark:text-bodydark'>Philippines</option>
                    <option value='Poland' className='text-body dark:text-bodydark'>Poland</option>
                    <option value='Portugal' className='text-body dark:text-bodydark'>Portugal</option>
                    <option value='Qatar' className='text-body dark:text-bodydark'>Qatar</option>
                    <option value='Romania' className='text-body dark:text-bodydark'>Romania</option>
                    <option value='Russia' className='text-body dark:text-bodydark'>Russia</option>
                    <option value='Rwanda' className='text-body dark:text-bodydark'>Rwanda</option>
                    <option value='Saint Kitts and Nevis' className='text-body dark:text-bodydark'>Saint Kitts and Nevis</option>
                    <option value='Saint Lucia' className='text-body dark:text-bodydark'>Saint Lucia</option>
                    <option value='Saint Vincent and the Grenadines' className='text-body dark:text-bodydark'>Saint Vincent and the Grenadines</option>
                    <option value='Samoa' className='text-body dark:text-bodydark'>Samoa</option>
                    <option value='San Marino' className='text-body dark:text-bodydark'>San Marino</option>
                    <option value='Sao Tome and Principe' className='text-body dark:text-bodydark'>Sao Tome and Principe</option>
                    <option value='Saudi Arabia' className='text-body dark:text-bodydark'>Saudi Arabia</option>
                    <option value='Senegal' className='text-body dark:text-bodydark'>Senegal</option>
                    <option value='Serbia' className='text-body dark:text-bodydark'>Serbia</option>
                    <option value='Seychelles' className='text-body dark:text-bodydark'>Seychelles</option>
                    <option value='Sierra Leone' className='text-body dark:text-bodydark'>Sierra Leone</option>
                    <option value='Singapore' className='text-body dark:text-bodydark'>Singapore</option>
                    <option value='Slovakia' className='text-body dark:text-bodydark'>Slovakia</option>
                    <option value='Slovenia' className='text-body dark:text-bodydark'>Slovenia</option>
                    <option value='Solomon Islands' className='text-body dark:text-bodydark'>Solomon Islands</option>
                    <option value='Somalia' className='text-body dark:text-bodydark'>Somalia</option>
                    <option value='South Africa' className='text-body dark:text-bodydark'>South Africa</option>
                    <option value='South Sudan' className='text-body dark:text-bodydark'>South Sudan</option>
                    <option value='Spain' className='text-body dark:text-bodydark'>Spain</option>
                    <option value='Sri Lanka' className='text-body dark:text-bodydark'>Sri Lanka</option>
                    <option value='Sudan' className='text-body dark:text-bodydark'>Sudan</option>
                    <option value='Suriname' className='text-body dark:text-bodydark'>Suriname</option>
                    <option value='Sweden' className='text-body dark:text-bodydark'>Sweden</option>
                    <option value='Switzerland' className='text-body dark:text-bodydark'>Switzerland</option>
                    <option value='Syria' className='text-body dark:text-bodydark'>Syria</option>
                    <option value='Taiwan' className='text-body dark:text-bodydark'>Taiwan</option>
                    <option value='Tajikistan' className='text-body dark:text-bodydark'>Tajikistan</option>
                    <option value='Tanzania' className='text-body dark:text-bodydark'>Tanzania</option>
                    <option value='Thailand' className='text-body dark:text-bodydark'>Thailand</option>
                    <option value='Timor-Leste' className='text-body dark:text-bodydark'>Timor-Leste</option>
                    <option value='Togo' className='text-body dark:text-bodydark'>Togo</option>
                    <option value='Tonga' className='text-body dark:text-bodydark'>Tonga</option>
                    <option value='Trinidad and Tobago' className='text-body dark:text-bodydark'>Trinidad and Tobago</option>
                    <option value='Tunisia' className='text-body dark:text-bodydark'>Tunisia</option>
                    <option value='Turkey' className='text-body dark:text-bodydark'>Turkey</option>
                    <option value='Turkmenistan' className='text-body dark:text-bodydark'>Turkmenistan</option>
                    <option value='Tuvalu' className='text-body dark:text-bodydark'>Tuvalu</option>
                    <option value='Uganda' className='text-body dark:text-bodydark'>Uganda</option>
                    <option value='Ukraine' className='text-body dark:text-bodydark'>Ukraine</option>
                    <option value='United Arab Emirates' className='text-body dark:text-bodydark'>United Arab Emirates</option>
                    <option value='United Kingdom' className='text-body dark:text-bodydark'>United Kingdom</option>
                    <option value='United States' className='text-body dark:text-bodydark'>United States</option>
                    <option value='Uruguay' className='text-body dark:text-bodydark'>Uruguay</option>
                    <option value='Uzbekistan' className='text-body dark:text-bodydark'>Uzbekistan</option>
                    <option value='Vanuatu' className='text-body dark:text-bodydark'>Vanuatu</option>
                    <option value='Vatican City' className='text-body dark:text-bodydark'>Vatican City</option>
                    <option value='Venezuela' className='text-body dark:text-bodydark'>Venezuela</option>
                    <option value='Vietnam' className='text-body dark:text-bodydark'>Vietnam</option>
                    <option value='Yemen' className='text-body dark:text-bodydark'>Yemen</option>
                    <option value='Zambia' className='text-body dark:text-bodydark'>Zambia</option>
                    <option value='Zimbabwe' className='text-body dark:text-bodydark'>Zimbabwe</option>
                </select>
                <span className='absolute top-1/2 right-4 z-10 -translate-y-1/2'>
                    <CaretDown size={20} />
                </span>


            </div>
        </div>
    )
}
