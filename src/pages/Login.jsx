import { Box, FormControl, FormLabel, Input, Checkbox, Stack, Button, Heading, Text, useToast } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin, login, signup } from "../redux/Auth/actions";
import axios from "axios";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useGoogleLogin } from "@react-oauth/google";
import { LoadingLogin } from "../components/LoadingLogin";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((store) => store.AuthReducer);
  const navigate = useNavigate();
  const location = useLocation();
  const comingFrom = location.state?.from?.pathname || "/";

  const handleSubmit = async (e, user = { email, password }) => {
    if (typeof e !== 'number') e.preventDefault();
    const userType = user?.email?.includes('admin') ? 'admin' : 'user';
    try {
      const loginFunc = e!==1?login:googleLogin;
      const {data} = await dispatch(loginFunc(user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAuth", new Date().getTime() + 4 * 60 * 60 * 1000 + 59 * 60 * 1000);
      loginSuccessToast(user, userType);
      navigate(userType === 'admin' ? '/admin' : comingFrom, { replace: true })
    } catch (error) {
      if(e!==1)loginFailureToast(error)
      throw error;
    }
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

  let loginFailureToast = (error) => {
    return toast({
      title: "Wrong Creadentials",
      description: error.response.data.msg,
      status: "error",
      duration: 3000,
      position: "top",
      isClosable: true,
    });
  }

  const getGoogleUserDetails = (tokenResponse) => {
    try {
      const accessToken = tokenResponse.access_token;
      axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: {Authorization: `Bearer ${accessToken}`},
      }).then((response) => {
        const user = { email: response.data.email, name: response.data.name, password:generateRandomPassword(), wallet: 100, picture: response.data.picture };
        const userType = response?.data.email?.includes('admin') ? 'admin' : 'user';
        handleSubmit(1, user).catch(async (error) => {
          if (error.response.data.msg === 'User not found') {
            await dispatch(signup(user));
            const { data } = await dispatch(googleLogin({email:user?.email}));
            localStorage.setItem("token", data.token);
            localStorage.setItem("isAuth", new Date().getTime() + 4 * 60 * 60 * 1000 + 59 * 60 * 1000);
            loginSuccessToast(user, userType);
            navigate(userType === 'admin' ? '/admin' : comingFrom, { replace: true })
          } else loginFailureToast(error);
        });
      }).catch((error) => console.log("error while login", error));
    } catch (error) {
      console.log("error while login", error);
    }
  };

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

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => getGoogleUserDetails(tokenResponse),
  });

  return <div id="login">
    {isLoading && <LoadingLogin message="Take some breaths 🌬️, We are 🔍 Authenticating... This may take 10 sec - 2 minutes ⏳" />}
    {!isLoading && (
      <Box
        bgImage="url('https://masai-course.s3.ap-south-1.amazonaws.com/editor/uploads/2023-04-20/login_image_242146.png')"
        bgSize="cover"
        bgPosition="center"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Box
          w="100%"
          maxW="lg"
          bg="white"
          borderRadius="lg"
          boxShadow="xl"
          p={8}
          overflow="hidden"
        >
          <Stack spacing={8} align="center">
            <Heading color="#002E6E" fontSize="4xl">
              Log in to your account
            </Heading>
            <form onSubmit={handleSubmit}>
              <Stack spacing={6}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    focusBorderColor="#002E6E"
                    borderColor={"#002E6E"}
                    type="email"
                    name="email"
                    placeholder="Enter @gmail.com"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    focusBorderColor="#002E6E"
                    borderColor={"#002E6E"}
                    placeholder="Enter pass ***"
                    type="password"
                    name="password"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Stack spacing={5}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Checkbox>Remember me</Checkbox>
                    <Link color={"blue.400"}>Forgot password?</Link>
                  </Stack>
                  <Button
                    type="submit"
                    bg={"#ED7745"}
                    color={"white"}
                    _hover={{ bg: "#d55f2b" }}
                  >
                    Log In
                  </Button>
                  <Box textAlign="center">
                    <GoogleLoginButton onClick={loginWithGoogle} />
                  </Box>
                  <Box display={"flex"} justifyContent="center">
                    <Text as={"span"} textAlign={"center"}>
                      Dont have Account ?{" "}
                    </Text>
                    <Text color="#002E6E" fontWeight="600" as={"span"}>
                      <Link to={"/signup"}>Sign Up</Link>
                    </Text>
                  </Box>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Box>
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="rgba(0,0,0,0.6)"
          zIndex="-1"
        />
      </Box>
    )}
  </div>
};