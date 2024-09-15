import { useNavigate } from 'react-router';

export const withRouter = (Component) => {
    const Wrapper = (props) => {
        const navigate = useNavigate();
        return <Component navigate={navigate} {...props} />
    } 
    return Wrapper;
}
