import jwt from 'jsonwebtoken';


export const generateTokens = (userId) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
  }

  const accessToken = jwt.sign({userId} , ACCESS_TOKEN_SECRET , {
    expiresIn: '1year' 
  })

  return { accessToken } 
}


export const setCookies = (res, accessToken) => {
  const isProduction = process.env.NODE_ENV === 'production'
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    // In production, allow cross-site cookies for frontend on a different domain
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: 365 * 24 * 60 * 60 * 1000
  })
}