import React, { useRef, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import leoProfanity from 'leo-profanity';
import { ApiContext, AuthContext } from '../contexts/index.js';
import { selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { selectors as messagesSelectors } from '../slices/messagesSlice.js';

const Messagess = () => {
  const { t } = useTranslation();
  const messages = useSelector(messagesSelectors.selectAll);
  const { currentChannelId } = useSelector((state) => state.channels);
  const activeChanel = useSelector((state) => channelsSelectors
    .selectById(state, currentChannelId));
  const currentMessages = messages.filter((m) => m.chanelId === currentChannelId);

  const chat = useContext(ApiContext);
  const auth = useContext(AuthContext);

  const inputRef = useRef();
  const lastMessageRef = useRef();

  useEffect(() => inputRef.current.focus());
  useEffect(() => {
    lastMessageRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  }, [currentMessages]);

  const validationSchema = yup.object().shape({
    body: yup.string()
      .trim()
      .required(),
  });

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {' '}
              {activeChanel?.name ?? ''}
            </b>
          </p>
          <span className="text-muted">
            {t('messages.counter.key', { count: currentMessages.length })}
          </span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {currentMessages.map((m) => (
            <div className="text-break mb-2" key={m.id}>
              <b>{m.username}</b>
              :
              {' '}
              {m.body}
            </div>
          ))}
          <span ref={lastMessageRef} />
        </div>
        <div className="mt-auto px-5 py-3">
          <Formik
            initialValues={{
              body: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              const { body } = values;
              const data = {
                body: leoProfanity.clean(body),
                chanelId: currentChannelId,
                username: auth.user.username,
              };
              chat.sendNewMessage(data);
              resetForm();
            }}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="py-1 border rounded-2">
                <div className="input-group has-validation">
                  <input name="body" ref={inputRef} aria-label={t('messages.new')} onChange={handleChange} placeholder={t('messages.input')} className="border-0 p-0 ps-2 form-control" value={values.body} />
                  <button type="submit" disabled="" className="btn btn-group-vertical">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" /></svg>
                    <span className="visually-hidden">{t('messages.send')}</span>
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default Messagess;
