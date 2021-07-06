import React, { useEffect, useState } from 'react';
import './app.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [submitBtn, setSubmitBtn] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // post the user data from form ///////////////////////////////////////////
  const onSubmit = data => {
    setSubmitBtn(true);
    reset();
    console.log(data);

    //posting user data to http://localhost:8000/users endpoint
    axios
      .post('http://localhost:8000/users', {
        data,
      })
      .then(res => {
        alert(
          `Post ${res.statusText} to http://localhost:8000/users with the success status code ${res.status}`
        );
        setSubmitBtn(false);
      })
      .catch(error => {
        alert(error.message);
        setSubmitBtn(false);
      });
  };

  // fetch data from json-server
  useEffect(() => {
    axios
      .get('http://localhost:8000/form_inputs')
      .then(res => setData(res.data))
      .catch(err => alert(err));
  }, []);

  return (
    <>
      {!data ? (
        <span className="loading">Loading...</span>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="app">
          {data.map((input, index) => (
            <div key={index}>
              {input.type !== 'select' ? (
                <div className="app__inputBlock">
                  <label className="app__label" htmlFor={input.name}>
                    {input.label}
                  </label>
                  <div className="app__inputField">
                    <input
                      {...register(input.name, {
                        required: true,
                      })}
                      className="app__input"
                      type={input.type}
                      placeholder={input.placeholder}
                      name={input.name}
                      defaultValue={input.default_value}
                      multiple={input.multiple}
                      readOnly={input.readonly}
                      title={input.info}
                    />

                    {errors[`${input.name}`]?.type === 'required' && (
                      <p className="app__validationMessage">
                        {input.label} is required
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="app__inputBlock">
                  <label className="app__label" htmlFor={input.name}>
                    {input.label}
                  </label>
                  <div className="app__inputField">
                    <select
                      {...register(input.name, {
                        required: true,
                      })}
                      className="app__input"
                      defaultValue={input.default_value}
                      name={input.name}
                      placeholder={input.placeholder}
                      readOnly={input.readonly}
                      multiple={input.multiple}
                      title={input.info}>
                      {input.options?.map((option, index) => (
                        <option
                          className="app__selectOption"
                          key={index}
                          value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="app__submitBtn">
            <label className="app__label"></label>
            <input
              onClick={handleSubmit(onSubmit)}
              className={`app__submit`}
              type="submit"
              value="Save"
              disabled={submitBtn}
            />
          </div>
        </form>
      )}
    </>
  );
}

export default App;
