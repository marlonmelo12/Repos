import { useCallback, useState, useEffect } from "react";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa';

import octokit from '../../services/api'
import { Link } from "react-router-dom";

export default function Main(){

    const[newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState(() => {
        const repoStorage = localStorage.getItem('repos');
        if (repoStorage) {
          return JSON.parse(repoStorage);
        }
        return [];
      });
    const[loading, setLoading] = useState(false);
    const[alert, setAlert] = useState(null);

    useEffect(()=>{
        const repoStorage = localStorage.getItem('repos');

        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage));
        }
    },[])

    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios));
      }, [repositorios]);

    const handleSubmit = useCallback((e)=>{
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        async function submit() {
            try{

                if(newRepo === ''){
                    throw new Error('Você precisa indicar um repositorio');
                }

                const [owner, repo] = newRepo.split('/');
                const response = await octokit.request('GET /repos/{owner}/{repo}', {
                    owner: owner,
                    repo: repo,
                });
                const hasRepo = repositorios.find(repos => repos.name === newRepo);
                if(hasRepo){
                    throw new Error('Repositorio duplicado');
                }
                const data = {
                    name: response.data.full_name,
                }
                setRepositorios([...repositorios, data]);
                setNewRepo('');
            }catch(error){
                setAlert(true);
            }finally{
                setLoading(false);
            }
        }

            submit();
    }, [newRepo, repositorios]);

    function handleInputChange(e){
        setNewRepo(e.target.value);
        setAlert(null);
    }

    const handleDelete = useCallback((repos)=>{
        const find = repositorios.filter(r => r.name !== repos);
        setRepositorios(find);
    },[repositorios])

    return(
        <Container>
            <h1>
                <FaGithub size={25}/>
                Meus Repositorios
            </h1>
            <Form onSubmit={handleSubmit} error={alert}>
                <input 
                type="text" 
                placeholder="Adicionar Repositorios"
                value={newRepo}
                onChange={handleInputChange}
                />

                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14}/>
                    ) : (
                        <FaPlus color="#FFF" size={14}/>
                    )
                    }
                </SubmitButton>
            </Form>

            <List>
                {repositorios.map(repos => (
                    <li key={repos.name}>
                        <span>
                            <DeleteButton onClick={()=>handleDelete(repos.name)}>
                                <FaTrash size={14}/>
                            </DeleteButton>
                            {repos.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repos.name)}`}>
                            <FaBars size={20}/>
                        </Link>
                    </li>
                ))}
            </List>

        </Container>
    )
} 