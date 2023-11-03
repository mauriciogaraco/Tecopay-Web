import { useState, createContext, useEffect } from "react";
import DetailUserEditComponent from "./DetailUserEditComponent";
import Fetching from "../../../components/misc/Fetching";
import TabNav from "../../../components/navigation/TabNav";
import useServerUser from "../../../api/userServerUser";


interface UserWizzardInterface {
  id: number | null;
  editUser: Function;
  deleteUser: Function;
  isFetching: boolean;
  closeModal: Function;
}

const EditUserContainer = ({
  id,
  editUser,

  isFetching,
  closeModal,
}: UserWizzardInterface) => {
  const { getUser, user, deleteUser, isLoading } = useServerUser();

  useEffect(() => {
    id && getUser(id);
  }, []);

  //Tabs data --------------------------------------------------------------------------------------------
  const [currentTab, setCurrentTab] = useState("details");
  const tabs = [
    { name: `Editar cuenta ${id}`, href: "details", current: currentTab === "details" },
  ];

  const action = (href: string) => setCurrentTab(href);

  //------------------------------------------------------------------------------------------------------

  if (isLoading)
    return (
      <div className="h-96">
        <Fetching />
      </div>
    );
  return (
    <div>
      {isFetching && <Fetching />}
      <TabNav tabs={tabs} action={action} />
      {currentTab === "details" && (
        <DetailUserEditComponent
          editUser={editUser}
          deleteUser={deleteUser}
          user={user}
          closeModal={closeModal}
          isFetching={isFetching}
        />
      )}

    </div>
  );
};

export default EditUserContainer;
