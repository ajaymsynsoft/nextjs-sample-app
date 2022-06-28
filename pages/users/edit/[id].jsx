import { useState, useEffect } from 'react';

import { Layout, AddEdit } from 'components/users';
import { userService, alertService ,preferanceService} from 'services';

export default Edit;

function Edit({ id }) {
    const [user, setUser] = useState(null);
    const [preferances, setPreferances] = useState([]);

    useEffect(() => {
        // fetch user and set default form values if in edit mode
        userService.getById(id)
            .then(x => setUser(x))
            .catch(alertService.error)

            preferanceService.preferancesList()
            .then(x => setPreferances(x.data))
            .catch(alertService.error)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout>
           
            <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600 text-center">
            Edit User
            </h1>
            {user ? <AddEdit user={user} preferances={preferances} /> :"" }
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    return {
        props: { id: params.id }
    }
}
