import { useEffect, useState } from 'react'
import './App.css'
import './App.scss'
import skyDropLogo from './assets/SkyDrop.png'
import axios from 'axios'
import ProductList from './ProductList.jsx'

const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001'

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [showSignup, setShowSignup] = useState(false)
	const [signupData, setSignupData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: '',
		birthdate: '',
		phone: '',
	})
	const [signupError, setSignupError] = useState('')
	const [products, setProducts] = useState([])

	useEffect(() => {
		const user = localStorage.getItem('user')
		if (user) {
			setIsLoggedIn(true)
		}
	}, [])

	useEffect(()=>{
		if( isLoggedIn && JSON?.parse(localStorage.getItem('user'))?.token ) {
			axios.get(`${baseUrl}/product`, {
				headers: {token: JSON?.parse(localStorage.getItem('user'))?.token}
			}).then(response => {
				console.log('products',response.data)
				setProducts(response.data)
			})
		}
	},[isLoggedIn])


	const handleLogin = (e) => {
		e.preventDefault()

		if (username && password) {
			axios.post(`${baseUrl}/user/login`, { email: username, password:password }).then(response => {
				console.log(response)
				if (response.status === 200) {
					setIsLoggedIn(true)
					localStorage.setItem('user', JSON.stringify(response.data))
				}
			})
			.catch(error => {
				console.error(error)
				alert("Erreur lors de la connexion. Veuillez vérifier vos identifiants.")
			})
		}
	}

	if (!isLoggedIn) {

		const handleSignupChange = (e) => {
			setSignupData({ ...signupData, [e.target.name]: e.target.value })
		}

		const handleSignup = async (e) => {
			e.preventDefault()
			setSignupError('')
			// Simple validation
			if (
				!signupData.email ||
				!signupData.password ||
				!signupData.confirmPassword ||
				!signupData.firstName ||
				!signupData.lastName ||
				!signupData.birthdate ||
				!signupData.phone
			) {
				setSignupError('Veuillez remplir tous les champs.')
				return
			}
			if (signupData.password !== signupData.confirmPassword) {
				setSignupError('Les mots de passe ne correspondent pas.')
				return
			}
			try {
				axios.put(`${baseUrl}/user`, signupData).then(response => {
					console.log(response)
					if (response.status === 200) {
						setIsLoggedIn(true)
						localStorage.setItem('user', JSON.stringify(response.data))
					}
			})
			} catch (err) {
				setSignupError("Erreur lors de l'inscription.")
			}
		}

		return (
			<div className="flex items-center justify-center w-full h-full ">
			{!showSignup ? (
				<form
				onSubmit={handleLogin}
				className="p-8 rounded shadow-md flex flex-col gap-4 min-w-[300px]"
				>
					<h2 className="text-xl font-bold mb-4">Connexion</h2>
					<label className="font-medium">Nom d'utilisateur :</label>
					<input
						type="text"
						placeholder="Nom d'utilisateur"
						value={username}
						onChange={e => setUsername(e.target.value)}
						className="border px-3 py-2 rounded"
						required
					/>
					<label className="font-medium">Mot de passe :</label>
					<input
						type="password"
						placeholder="Mot de passe"
						value={password}
						onChange={e => setPassword(e.target.value)}
						className="border px-3 py-2 rounded"
						required
					/>
					<button
						type="submit"
						className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
					>
						Se connecter
					</button>
					<button
						type="button"
						className="text-blue-600 underline"
						onClick={() => setShowSignup(true)}
					>
						S'inscrire
					</button>
				</form>
			) : (
				<form
				onSubmit={handleSignup}
				className="p-8 rounded shadow-md flex flex-col gap-4 min-w-[700px]"
				>
					<h2 className="text-xl font-bold mb-4">Inscription</h2>
					<label className="font-medium">Email :</label>
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={signupData.email}
						onChange={handleSignupChange}
						className="border px-3 py-2 rounded"
						required
					/>
					<label className="font-medium">Mot de passe :</label>
					<input
						type="password"
						name="password"
						placeholder="Mot de passe"
						value={signupData.password}
						onChange={handleSignupChange}
						className="border px-3 py-2 rounded"
						required
					/>
					<label className="font-medium">Confirmer le mot de passe :</label>
					<input
						type="password"
						name="confirmPassword"
						placeholder="Confirmer le mot de passe"
						value={signupData.confirmPassword}
						onChange={handleSignupChange}
						className="border px-3 py-2 rounded"
						required
					/>
					<div className='flex flex-row gap-12 justify-between'>
						<div className='flex flex-col gap-2 w-1/2'>
							<label className="font-medium">Prénom :</label>
							<input
							type="text"
							name="firstName"
							placeholder="Prénom"
							value={signupData.firstName}
							onChange={handleSignupChange}
							className="border px-3 py-2 rounded"
							required
							/>
						</div>
						<div className='flex flex-col gap-2 w-1/2'>
							<label className="font-medium">Nom :</label>
							<input
							type="text"
							name="lastName"
							placeholder="Nom"
							value={signupData.lastName}
							onChange={handleSignupChange}
							className="border px-3 py-2 rounded"
							required
							/>
						</div>
					</div>
					<label className="font-medium">Date de naissance :</label>
					<input
						type="date"
						name="birthdate"
						placeholder="Date de naissance"
						value={signupData.birthdate}
						onChange={handleSignupChange}
						className="border px-3 py-2 rounded"
						required
					/>
					<label className="font-medium">Téléphone :</label>
					<input
						type="tel"
						name="phone"
						placeholder="Téléphone"
						value={signupData.phone}
						onChange={handleSignupChange}
						className="border px-3 py-2 rounded"
						required
					/>
					{signupError && (
						<div className="text-red-600 text-sm">{signupError}</div>
					)}
					<button
						type="submit"
						className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
					>
						S'inscrire
					</button>
					<button
						type="button"
						className="text-blue-600 underline"
						onClick={() => setShowSignup(false)}
					>
						Retour à la connexion
					</button>
				</form>
			)}
			</div>
		)
	}

	return (
		<div className="App flex flex-col justify-start w-full h-full">
			<div className="w-full flex justify-between p-4">
				<img src={skyDropLogo} className="h-12" style={{transform: 'scale(1.5)'}} alt="SkyDrop Logo"  />
				<button
					className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
					onClick={() => {
						localStorage.removeItem('user')
						setIsLoggedIn(false)
						setUsername('')
						setPassword('')
					}}
				>
					Se déconnecter
				</button>
			</div>
			<div className="grow-1 p-8 h-full">
				<h1 className="text-2xl font-bold mb-4">Liste des produits</h1>
				<div>
					<ProductList products={products} />
				</div>
			</div>
		</div>
	)
}

export default App
