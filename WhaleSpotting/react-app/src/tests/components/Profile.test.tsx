import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Profile } from "../../components/Profile";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Button, Style } from "../../components/Button";
import {SightingApiModel} from "../../api/models/SightingApiModel";
import { UserApiModel } from "../../api/models/UserApiModel";
import { fetchPendingSightings, fetchCurrentUser } from "../../api/apiClient";
import { OrcaType, Species } from "../../api/ApiEnums";

const mockexample1: SightingApiModel = {
    id: 1,
    sightedAt: new Date().toDateString(),
    species: Species.Orca,
    quantity: 3,
    location: "Sea",
    longitude: 1.232,
    latitude: 2.312,
    description: "Whales at sea",
    orcaType: OrcaType.Offshore,
    orcaPod: "",
    confirmed: true,
    username: "FakeUserConfirmed"
};

const mockexample2: SightingApiModel = {
    id: 2,
    sightedAt: new Date().toDateString(),
    species: Species.Minke,
    quantity: 3,
    location: "Sea",
    longitude: 1.232,
    latitude: 2.312,
    description: "Whales at sea",
    orcaType: null,
    orcaPod: "",
    confirmed: true,
    username: "FakeUserConfirmed"
};

test("renders the Sightings feed", () => {
    render(
        <Router>
            <Profile />
        </Router>
    );
    const title = screen.getByText("Your Sightings");
    expect(title).toBeInTheDocument();
});

test("When profile renders, it calls API and gets current user", () => {
    const user: UserApiModel = {
        username: "test",
        sightingsCount: 2
    };

    jest.mock("../../api/apiClient", () => ({
        __esModule: true,
        fetchCurrentUser: jest.fn(async () : Promise<UserApiModel> => {
            return Promise.resolve(user);
        })
    }));

    render(
        <Router>
            <Profile />
        </Router>
    );

    setTimeout(()=>{
        expect(fetchCurrentUser).toBeCalled();
    }, 100);

    const username = screen.getByTestId("username");
    expect(username).toBeInTheDocument();
});

test("When approval selected get data from API and change heading to Your Approvals", () => {
    jest.mock("../../api/apiClient", () => ({
        __esModule: true,
        fetchPendingSightings: jest.fn(async (): Promise<SightingApiModel[]> => {
            return Promise.resolve([]);
        })
    }));

    render(
        <Router>
            <Profile />
        </Router>
    );
    const approvalButton = screen.getByTestId("approval-toggle");
    userEvent.click(approvalButton);

    setTimeout(() => {
        expect(fetchPendingSightings).toBeCalled();
    }, 100);

    const title = screen.getByText("Your Approvals");
    expect(title).toBeInTheDocument();
});

test("When click next page approvals load new records", () => {
    jest.mock("../../api/apiClient", () => ({
        __esModule: true,
        fetchPendingSightings: jest.fn(async (pageNumber: number): Promise<SightingApiModel[]> => {
            switch (pageNumber) {
            case 1:
                return Promise.resolve([mockexample1]);
            case 2:
                return Promise.resolve([mockexample2]);
            default:
                return Promise.resolve([]);
            }
        })
    }));

    render(
        <Router>
            <Profile />
        </Router>
    );

    const approvalButton = screen.getByTestId("approval-toggle");
    userEvent.click(approvalButton);

    setTimeout(() => {
        expect(fetchPendingSightings(1)).toBeCalled();
    }, 100);

    const title = screen.getByText("Your Approvals");
    expect(title).toBeInTheDocument();

    setTimeout(() => {
        const nextPage = screen.getByTestId("next-page");
        userEvent.click(nextPage);
        const card = screen.getByTestId("card-component");
        expect(card).toBeInTheDocument();
        const firstExample = screen.getAllByText("orca");
        expect(firstExample).toBeInTheDocument();
    }, 200);

    setTimeout(() => {
        expect(fetchPendingSightings(2)).toBeCalled();
        const secondExample = screen.getAllByText("minke");
        expect(secondExample).toBeInTheDocument();
    }, 300);
});

test("User is admin, check RemoveAdmin & CheckApprovals do not have hidden attribute and AddAdmin has hidden attribute", () => {
    const isUserAdmin = true;
    render(
        <Router>
            <Button
                style={Style.secondary}
                text="Make Admin"
                hidden={isUserAdmin}
                dataTestId="make-admin" />
        </Router>
    );
    const addAdminButton = screen.getByTestId("make-admin");
    expect(addAdminButton).toHaveAttribute("hidden");

    render(
        <Router>
            <Button
                style={Style.secondary}
                text="Remove Admin"
                hidden={!isUserAdmin}
                dataTestId="remove-admin" />
        </Router>
    );
    const removeAdminButton = screen.getByTestId("remove-admin");
    expect(removeAdminButton).not.toHaveAttribute("hidden");

    render(
        <Router>
            <Button
                style={Style.secondary}
                text="Approvals"
                hidden={!isUserAdmin}
                dataTestId="approval-toggle" />
        </Router>
    );
    const approvalsButton = screen.getByTestId("approval-toggle");
    expect(approvalsButton).not.toHaveAttribute("hidden");
});

test("RemoveAdmin, CheckApprovals should have an attribute hidden and AddAdmin should not if user is not admin", () => {
    const isUserAdmin = false;
    render(
        <Router>
            <Button
                style={Style.secondary}
                text="Make Admin"
                hidden={isUserAdmin}
                dataTestId="make-admin" />
        </Router>
    );
    const addAdminButton = screen.getByTestId("make-admin");
    expect(addAdminButton).not.toHaveAttribute("hidden");

    render(
        <Router>
            <Button
                style={Style.secondary}
                text="Remove Admin"
                hidden={!isUserAdmin}
                dataTestId="remove-admin" />
        </Router>
    );
    const removeAdminButton = screen.getByTestId("remove-admin");
    expect(removeAdminButton).toHaveAttribute("hidden");

    render(
        <Router>
            <Button
                style={Style.secondary}
                text="Approvals"
                hidden={!isUserAdmin}
                dataTestId="approval-toggle" />
        </Router>
    );
    const approvalsButton = screen.getByTestId("approval-toggle");
    expect(approvalsButton).toHaveAttribute("hidden");
});

test("When profile renders, it calls API and gets current user", () => {
    const user: UserApiModel = {
        username: "test",
        sightingsCount: 2
    };

    jest.mock("../../api/apiClient", () => ({
        __esModule: true,
        fetchCurrentUser: jest.fn(async () : Promise<UserApiModel> => {
            return Promise.resolve(user);
        })
    }));

    render(
        <Router>
            <Profile />
        </Router>
    );

    setTimeout(()=>{
        expect(fetchCurrentUser).toBeCalled();
    }, 100);

    const username = screen.getByTestId("username");
    expect(username).toBeInTheDocument();
});
