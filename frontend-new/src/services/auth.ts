"use client"

import axios from "axios"
import Cookies from "js-cookie"

const signIn = async (email: string, password: string) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/token/`, {
    email: email,
    password: password
  });

  if (response.status === 200) {
    const { access, refresh } = response.data;

    Cookies.set("accessToken", access);
    Cookies.set("refreshToken", refresh);

    return { success: true, message: "Sign in successful" };
  } else {
    return { success: false, message: "Sign in failed" };
  }
}

const signUp = async (email: string, password: string) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/sign-up/`, {
    email: email,
    password: password
  });

  if (response.status === 201) {
    return { success: true, message: "Sign up successful" };
  } else {
    return { success: false, message: "Sign up failed" };
  }
}

export {
  signIn,
  signUp,
}
