import React, { ChangeEvent, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useNavigate } from "react-router-dom";
import { signUp } from "../utils/functions";
import { Style } from "../models/models";
import Loading from "../components/Loading";

const styles: Style = {
  main: "h-[90vh] w-screen flex items-center p-4",
  container: "max-w-[480px] max-h-[640px] p-4 bg-[#1f1f24] rounded-xl shadow-lg shadow-[#0c0c0c] mx-auto flex flex-col items-center",
  title: "text-3xl font-bold tracking-wide mt-4",
  form: "flex flex-col items-center gap-8 p-4",
  formContainer: "flex flex-col font-medium",
  button: "bg-[#333333] w-[200px] px-4 py-2 rounded-md font-medium hover:text-black duration-200 hover:bg-[#3c3c41]",
  input: "focus:outline-none px-4 py-2 w-[360px] rounded text-black",
};

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login, setLogin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [formIsLoading, setFormLoading] = useState<boolean>(false);
  const { isLoading, userSnap } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  if (userSnap) {
    navigate("/profile");
  }

  const handleEmail = (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const handlePassword = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
  const handleLogin = (event: ChangeEvent<HTMLInputElement>) => setLogin(event.target.value);

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!email || !password || !login) return setError("All fields required!");

    setError("");
    setFormLoading(true);

    try {
      await signUp(email, password, login);
    } catch (error: any) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("User with this email already exist.");
          break;
        case "auth/login-already-in-use":
          setError("User with this login already exist..");
          setPassword("");
          break;
        default:
          setError("Internal Error");
      }
    } finally {
      setFormLoading(false);
      if (!error) navigate("/profile");
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Create an Account</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            <label htmlFor="login">Login</label>
            <input
              id="login"
              onChange={handleLogin}
              className={styles.input}
              type="text"
            />
          </div>
          <div className={styles.formContainer}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              onChange={handleEmail}
              className={styles.input}
              type="email"
            />
          </div>
          <div className={styles.formContainer}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              onChange={handlePassword}
              className={styles.input}
              type="password"
            />
          </div>
          {error && <p>{error}</p>}
          <button className={styles.button} disabled={formIsLoading}>
            {formIsLoading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
