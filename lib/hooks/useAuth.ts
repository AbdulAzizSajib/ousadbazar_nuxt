import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { apiBasePharma } from "@/lib/config";

export interface SendOtpPayload {
  phone: string;
}

export interface SendOtpResponse {
  message?: string;
  status?: string;
}

export const useSendOtp = () =>
  useMutation<SendOtpResponse, unknown, SendOtpPayload>({
    mutationFn: async (payload) => {
      const res = await axios.post(`${apiBasePharma}/send-otp`, payload);
      return res.data;
    },
  });

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface VerifyOtpResponse {
  status: "success" | "error";
  message: string;
  token: string;
  mobile: string;
}

export const useVerifyOtp = () =>
  useMutation<VerifyOtpResponse, unknown, VerifyOtpPayload>({
    mutationFn: async (payload) => {
      const res = await axios.post(`${apiBasePharma}/verify-otp`, payload);
      return res.data;
    },
  });
