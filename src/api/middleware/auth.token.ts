import { NextFunction, Request, Response } from "express";
import jsonwebtoken, { verify, SignOptions } from "jsonwebtoken";
import { ErrorCodeMap, ErrorCodes } from "src/common/error-type";

export async function verifyAccessToken(token: string) {
    if (token) {
      try {
        const decoded = await verify(token, process.env.AUTH_KEY ?? "");
        // console.log(decoded);
        return decoded;
      } catch (error) {
        console.error(JSON.stringify(error));
        return false;
      }
    } else {
      return false;
    }
  }

export async function verifyAccessTokenRestApi(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (!request?.headers["authorization"]) {
      return response
          .status(ErrorCodeMap.INVALID_AUTH)
          .json({ message: "Invalid Authorization." });
  }
  const authHeader = request?.headers["authorization"]?.split(" ");
  if (!authHeader[1]) {
      return response
          .status(ErrorCodeMap.INVALID_AUTH)
          .json({ message: "Invalid Authorization." });
  }
  return new Promise((resolve, reject) => {
      verify(
          authHeader[1],
          process.env.AUTH_KEY ?? "",
          (error, decoded) => {
              if (error) {
                  return response
                      .status(ErrorCodeMap.INVALID_AUTH)
                      .json({ message: error });
              } else {
                  request.body.token = JSON.parse(JSON.stringify(decoded));
                  next();
              }
          }
      );
  });
}

