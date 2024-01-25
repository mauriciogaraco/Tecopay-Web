import { useState, useEffect } from "react";
import TabNav from "../../../components/navigation/TabNav";
import { FaBoxOpen } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBoxesStacked
} from "@fortawesome/free-solid-svg-icons";
import ReportsCardRequest from "./ReportsCardRequest";
import EditCardRequest from "./EditsCardRequest"

interface propsDestructured {
	close: Function;
	CRUD: any;
	id:number
}

const ModalCardRequest = ({ close, CRUD, id }: propsDestructured) => {

	useEffect(() => {
		CRUD.GetRequestRecord(id, {});
	}, []);

	const [currentTab, setCurrentTab] = useState("report");

	const tabs = [
		{
			icon: <FaBoxOpen />,
			name: "Reporte",
			href: "report",
			current: currentTab === "report",
		},
		{
			icon: <FontAwesomeIcon icon={faBoxesStacked} />,
			name: "Editar",
			href: "editar",
			current: currentTab === "editar",
		},
	];

	return (
		<div className="min-h-96">
			<TabNav action={setCurrentTab} tabs={tabs} />
				{currentTab === "report" && <ReportsCardRequest CRUD={CRUD} />}
				{currentTab === "editar" && <EditCardRequest CRUD={CRUD} id={id} close={close}/>}
		</div>
	);
};

export default ModalCardRequest;


