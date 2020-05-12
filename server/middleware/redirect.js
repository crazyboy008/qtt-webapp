export const redirect = app => {
  app.use(async (ctx, next) => {
    if (ctx.cookies.get('userInfo')) {
      console.log('userInfo:', ctx.cookies.get('userInfo'))
    } else {
      // ctx.redirect('/login')
    }
    await next();
  })
}