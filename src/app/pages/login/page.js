import { AuthContext } from "@/lib/context/AuthContext";
import LoginForm from "@/components/LoginForm";


const Home = () => {
  // const userInput = useRef(null);
  // const passwordInput = useRef(null);
  // const { state, dispatch } = useContext(AuthContext);

  // const handleLogin = (event) => {
  //   event.preventDefault(); // Prevent default form submission behavior
  //   const username = userInput.current.value;
  //   const password = passwordInput.current.value;

  //   fetch("/api/auth/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ "username": username, "password": password }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       dispatch({ type: "LOGIN_SUCCESS", payload: data });
  //     });
  // }

  // useEffect(() => {
  //   if (state.accessLevel === "SA") {
  //     redirect("/pages/role-determiner");
  //   }
  //   if (state.accessLevel === "USER") {
  //     redirect("/pages/role-determiner");
  //   }
  //   else {
  //     console.log("Invalid Access Level")
  //   }
  // }, [state]);


  return (
     <LoginForm />
  );
};

export default Home;
