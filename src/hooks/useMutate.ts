import { useToast, UseToastOptions } from "@chakra-ui/react";
import { AxiosResponse } from "axios";
import { useMutation } from "react-query";

type FetchFunction<T> = (data: T) => Promise<AxiosResponse<any, any>>;

export function useMutate<T>(
  fetchFn: FetchFunction<T>,
  {
    onSuccess,
    onSettled,
    onError,
  }: {
    onSuccess?: VoidFunction;
    onError?: VoidFunction;
    onSettled?: VoidFunction;
  },
  successToast?: UseToastOptions,
  failureToast?: UseToastOptions,
) {
  const toast = useToast();

  return useMutation(
    (data: T) => {
      return fetchFn(data);
    },
    {
      onSuccess: async () => {
        toast({
          title: "Successful",
          description: "Operation successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          ...successToast,
        });
        onSuccess && onSuccess();
      },
      onError: (err: Error) => {
        toast({
          title: "Failure",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          ...failureToast,
        });
        onError && onError();
      },
      onSettled: () => {
        onSettled && onSettled();
      },
    },
  );
}
