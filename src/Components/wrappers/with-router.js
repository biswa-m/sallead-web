import { useNavigate, useLocation, useParams } from "react-router-dom";

const withRouter =
  (WrappedComponent, opt = {}) =>
  (props) => {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

    let propsToBePassed = {
      ...props,
      router: { location, navigate, params },
    };
    if (opt?.keyExtractor) {
      propsToBePassed = {
        ...propsToBePassed,
        key: opt.keyExtractor(propsToBePassed),
      };
    }

    return <WrappedComponent {...propsToBePassed} />;
  };

export default withRouter;
