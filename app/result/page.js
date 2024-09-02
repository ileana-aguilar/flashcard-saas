'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import getStripe from "@/utils/get-stripe"
import { useSearchParams } from "next/navigation"
import { Box, CircularProgress, Container, Typography, AppBar, Toolbar, Button } from "@mui/material"
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link';

const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const sessionId = searchParams.get("session_id")    

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!sessionId) return
            
            try{
                const res = await fetch(`/api/checkout_sessions?session_id=${sessionId}`)
                const sessionData = await res.json()
                if (res.ok) {
                    setSession(sessionData)
                }else{
                    setError(sessionData.error)
                }

            } catch(err){
                console.error('Error fetching session', err)
                setError('An error occurred while fetching the session')
            } finally {
                setLoading(false)
            }
        }
        fetchCheckoutSession()

           
    }, [sessionId])

    if (loading){
        return (
            <Container maxWidth ='100vw' sx={{ textAlign: 'center', mt:4}}>
                <CircularProgress/>
                <Typography variant='h6'>Loading...</Typography>
            </Container>
            )
    }
    if (error){
        return (
            <Container maxWidth ='100vw' sx={{ textAlign: 'center', mt:4}}>
                <Typography variant='h6' color='error'>{error}</Typography>
            </Container>
            )
    }
    return(
        <Container maxWidth ='100vw' >
             <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow:'none' }} >
             <Toolbar sx={{display:'flex', justifyContent: 'space-between'}} >
            <Link href="/" passHref style={{textDecoration: 'none'}}>
                    <Typography variant="h6" style={{flexGrow: 1, color: '#8365A6', fontSize:'30px', textDecoration: 'none'}}>
                        Quizin
                    </Typography>
                </Link>
            <SignedOut>
                <Box>
                    <Button variant="text" sx={{ color:'#8365A6' }}  href="/sign-in">Login</Button>
                    <Button variant="contained" sx={{ borderRadius: '10px', bgcolor:'#8365A6', boxShadow:'none' }} href="/sign-up">Sign Up</Button>
                </Box>
            </SignedOut>
            <SignedIn>
                <Box>
                    <Button variant="text" sx={{ color:'#8365A6' }}  href="/sign-in">Login</Button>
                    <Button variant="contained" sx={{ borderRadius: '10px', bgcolor:'#8365A6', boxShadow:'none' }} href="/sign-up">Sign Up</Button>
                    <UserButton />
                </Box>
          </SignedIn>
        </Toolbar>
      </AppBar>
           { session.payment_status === "paid" ? (
                <Box sx={{ textAlign: 'center', mt:4}}>
                    <Typography variant='h6'>Your order was successful!</Typography>
                    <Typography variant='h6'>Thank you for your purchase</Typography>
                    <Box sx={{ mt: 22 }}>
                        <Typography variant='h6'>Session ID: {session.id}</Typography>
                        <Typography variant="body1">
                            We have received your payment. You will receive an email confirmation shortly.
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ textAlign: 'center', mt:4}}>
                    <Typography variant='h6'>Payment Failed</Typography>
                    <Box sx={{ mt: 22 }}>
                        <Typography variant="body1">
                        Your order was not successful. Please try again.
                        </Typography>
                    </Box>
                </Box>
                
            )}
        </Container>
    )
}
export default ResultPage
