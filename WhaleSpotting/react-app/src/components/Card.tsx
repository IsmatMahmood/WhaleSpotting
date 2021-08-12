import "../styles/Card.scss";
import React, { useState } from "react";
import { SightingApiModel } from "../api/models/SightingApiModel";
import { Button, Style } from "./Button";
import { deleteSighting, confirmSighting } from "../api/apiClient";
import { Species } from "../api/ApiEnums";
import { WhaleVisualTextDictionary, OrcaTypeTextDictionary } from "../api/ApiLookups";

interface CardProps {
    sighting: SightingApiModel;
    admin?: boolean;
}

export default function Card({ sighting, admin = false }: CardProps): JSX.Element {
    const [checked, setChecked] = useState(false);
    const [closeCard, setCardState] = useState(true);
    
    return (
        <div hidden={checked} data-testid="sighting-card">
            <div className="card-component" data-testid="card-component">
                {!sighting.confirmed && <div className="pending" data-testid="pending"> PENDING </div>}
                <div className="card-info"
                    onClick={() => setCardState(!closeCard)} data-testid="card">
                    <div className="first-column">
                        <div>Sighted At: {sighting.sightedAt.split("T")[0].replaceAll("-", "/")}</div>
                        <div>Species: {WhaleVisualTextDictionary[sighting.species]}</div>
                        <div>Location: {sighting.location}</div>
                        <div>Quantity: {sighting.quantity}</div>
                        <div>Reported By: {sighting.username} </div>
                    </div>
                    <div data-testid="second-column" className={closeCard ? "second-column closed" : "second-column open"}>
                        <div>Orca type: {sighting.orcaType === null ? "" : OrcaTypeTextDictionary[sighting.orcaType]}</div>
                        <div>Orca pod: {sighting.orcaPod}</div>
                        <div>Longitude: {sighting.longitude} </div>
                        <div>Latitude: {sighting.latitude} </div>
                        <div>Description: {sighting.description} </div>
                    </div>
                </div>
            </div>
            {!sighting.confirmed && admin && <div className="buttons-container" >
                <Button
                    style={Style.reject}
                    text="Reject"
                    onClick={() => {
                        deleteSighting(sighting.id);
                        setChecked(true);
                    }}
                    minWidth25={true}
                />
                <Button
                    dataTestId="approve-button"
                    style={Style.primary}
                    text="Approve"
                    onClick={() => {
                        confirmSighting(sighting.id);
                        setChecked(true);
                    }}
                    minWidth25={true}
                />
            </div>}
        </div>
    );
}