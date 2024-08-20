export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})

    const searchParams = useSearchParams()
    const search = searchParams.get('id')
    const router = useRouter()
    

    
    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
      }
      

    // ... (rest of the component)
    useEffect(() => {
        async function getFlashcards() {
          if (!user) return
          const docRef = doc(collection(db, 'users'), user.id)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            setFlashcards(collections)
          } else {
            await setDoc(docRef, { flashcards: [] })
          }
        }
        getFlashcards()
      }, [user])


      useEffect(() => {
        async function getFlashcard() {
          if (!search || !user) return
      
          const colRef = collection(doc(collection(db, 'users'), user.id), search)
          const docs = await getDocs(colRef)
          const flashcards = []
          docs.forEach((doc) => {
            flashcards.push({ id: doc.id, ...doc.data() })
          })
          setFlashcards(flashcards)
        }
        getFlashcard()
      }, [search, user])


      return (
        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )
  }
