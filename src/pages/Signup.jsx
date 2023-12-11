import { Flex, Box, FormControl, FormLabel, Input, Stack, Button, Heading, Text, useToast } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLoginButton } from "react-social-login-buttons";
import { googleLogin, signup } from "../redux/Auth/actions";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import axios from "axios";
import { LoadingLogin } from "../components/LoadingLogin";

export const Signup = () => {
    const initUser = { email: "", password: "", name: "", wallet: 100 };
    const [user, setUser] = useState(initUser);
    const { isLoading } = useSelector((store) => store.AuthReducer);
    const toast = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const comingFrom = location.state?.from?.pathname || "/";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const getGoogleUserDetails = (tokenResponse) => {
        const accessToken = tokenResponse.access_token;
        axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
            headers: { Authorization: `Bearer ${accessToken}` },
        }).then((response) => {
            const newUser = { email: response.data.email, name: response.data.name, password: generateRandomPassword(), wallet: 100, picture: response.data.picture };
            handleSubmit(1, newUser);
        });
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: (tokenResponse) => getGoogleUserDetails(tokenResponse),
    });

    const handleSubmit = async (e, user) => {
        if (typeof e !== 'number') e.preventDefault();
        const userType = user?.email?.includes('admin') ? 'admin' : 'user';
        try {
            const res = await dispatch(signup(user));
            newToastSucess(res.data.msg);
            if (e !== 1) navigate("/login");
            else {
                const { data } = await dispatch(googleLogin({ email: user?.email }));
                localStorage.setItem("token", data.token);
                localStorage.setItem("isAuth", new Date().getTime() + 4 * 60 * 60 * 1000 + 59 * 60 * 1000);
                loginSuccessToast(user, userType);
                navigate(userType === 'admin' ? '/admin' : comingFrom, { replace: true })
            }
        } catch (error) {
            if (e === 1 && error?.response?.data?.msg === 'User already registered') {
                const { data } = await dispatch(googleLogin(user));
                localStorage.setItem("token", data.token);
                localStorage.setItem("isAuth", new Date().getTime() + 4 * 60 * 60 * 1000 + 59 * 60 * 1000);
                loginSuccessToast(user, userType);
                navigate(userType === 'admin' ? '/admin' : comingFrom, { replace: true })
            } else newToastFail(error);
        }
    };

    let newToastSucess = (msg) => {
        return toast({
            title: msg,
            status: "success",
            duration: 3000,
            position: "top",
            isClosable: true,
        });
    };
    let newToastFail = (error) => {
        return toast({
            title: "Unable to create account.",
            description: error?.response?.data?.msg,
            status: "error",
            duration: 3000,
            position: "top",
            isClosable: true,
        });
    };

    let loginSuccessToast = (user, userType) => {
        return toast({
            title: 'Logged in successfully',
            description: ` Welcome ${userType === 'user' ? 'User' : 'Admin'} ${user.email}`,
            status: "success",
            duration: 3000,
            position: "top",
            isClosable: true,
        });
    }

    const generateRandomPassword = () => {
        const length = 10; // Specify the desired length of the random password
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let password = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters.charAt(randomIndex);
        }

        if (password.length < 8) {
            password += "123"; // Add some numbers at the end to meet the minimum length requirement
        }
        if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
            password += "A"; // Add a letter at the end to meet the requirement of having at least 1 letter and 1 number
        }
        return password;
    };

    // Google One Tap Authentication

    // useGoogleOneTapLogin({
    //   onSuccess: credentialResponse=>{
    //     console.log('credentialResponse',credentialResponse)
    //     if (credentialResponse.credential) {
    //   const idToken = credentialResponse.credential;
    //   const url =`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`
    //   axios.get(url).then(res=>console.log('res',res));
    //     }
    //   },
    //   onError: () => {
    //     console.log('Login Failed');
    //   },
    // });

    return (
        <div id="signup">
            {isLoading && <LoadingLogin message={"Welcome to CalendarAI! 🎉 We're processing your details.. It may take 10 sec - 2 minutes ⏳"} />}
            {!isLoading && (
                <Flex minH={"100vh"} align={"center"} justify={"center"} backgroundSize={"cover"} backgroundPosition={"center"} backgroundImage={"url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')"}
                >
                    <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                        <Stack align={"center"}>
                            <Heading color="#002E6E" fontSize="4xl">Create your account</Heading>
                        </Stack>
                        <Box rounded={"lg"} boxShadow={"lg"} p={8} bg={"white"} background={"rgba(255, 255, 255, 1.75)"}
                        >
                            <form onSubmit={(e) => handleSubmit(e, user)}>
                                <Stack spacing={4}>
                                    <FormControl id="name">
                                        <FormLabel color={"#002E6E"}>Name</FormLabel>
                                        <Input
                                            focusBorderColor="#002E6E"
                                            borderColor={"#002E6E"}
                                            placeholder="Enter Name"
                                            type="text"
                                            name="name"
                                            value={user.name}
                                            onChange={handleChange}
                                            required
                                            autoComplete="name"
                                        />
                                    </FormControl>
                                    <FormControl id="email">
                                        <FormLabel color={"#002E6E"}>Email address</FormLabel>
                                        <Input
                                            focusBorderColor={"#002E6E"}
                                            placeholder="Enter @gmail.com"
                                            borderColor={"#002E6E"}
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={handleChange}
                                            autoComplete="email"
                                            required
                                        />
                                    </FormControl>
                                    <FormControl id="password">
                                        <FormLabel color={"#002E6E"}>Password</FormLabel>
                                        <Input
                                            focusBorderColor={"#002E6E"}
                                            placeholder="Enter password ***"
                                            borderColor={"#002E6E"}
                                            type="password"
                                            name="password"
                                            value={user.password}
                                            onChange={handleChange}
                                            autoComplete="current-password"
                                            required
                                        />
                                    </FormControl>
                                    <Button type="submit" bg={"#ED7745"} color={"white"}>Sign up</Button>
                                    <GoogleLoginButton text="Sign Up with Google" onClick={loginWithGoogle} />
                                    <Box display={"flex"} justifyContent="space-evenly">
                                        <Text as={"span"} textAlign={"center"}>Already have an account?{" "}</Text>
                                        <Text fontWeight="600" color="#002E6E" as={"span"}><Link to={"/login"}>Log in</Link></Text>
                                    </Box>
                                </Stack>
                            </form>
                        </Box>
                    </Stack>
                </Flex>
            )}
        </div>
    );
};