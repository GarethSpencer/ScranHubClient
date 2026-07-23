import Accordion from "react-bootstrap/Accordion";

const FurtherInformationPage = () => {
  return (
    <>
      <h2 className="mb-3 lead">User Details</h2>
      <p className="text-muted small mb-3">
        The navigation bar of ScranHub allows you to change your username
        (display name) at any time. This can make it easier for other users to
        find you. You can also optionally set a starting location, which will
        allow the app to calculate your distance from each venue and even link
        to Google Maps to show you the directions to get there.
      </p>
      <h2 className="mb-3 lead">Manage Friends</h2>
      <p className="text-muted small mb-3">
        Here you can view and manage your friends list, find other ScranHub
        users to send friend requests to, and respond to your received friend
        requests. You can add friends by searching for their display name.
        Alternatively, if you know their email address you can send them a
        request using that. Any received friend requests will appear on your
        navbar so you can see and respond to them immediately.
      </p>
      <h2 className="mb-3 lead">Manage Groups</h2>
      <p className="text-muted small mb-3">
        Here you can view and manage your own groups, and search for groups
        created by your friends to join. Your groups are split into those you
        have created yourself, and those you have joined. You can leave groups
        you have joined at any time. Similarly, you can delete groups you have
        created at any time, which will also delete all venues and ratings
        associated with the group. You can also rename your groups at any time,
        and optionally set a group icon on the ScranHub home page which every
        group member will be able to see.
      </p>
      <h2 className="mb-3 lead">My Groups</h2>
      <p className="text-muted small mb-3">
        Each ScranHub group has its own dedicated set of pages. Everyone in the
        group will be able to interact with these pages. Groups are split into
        four tabs. Expand a section below to learn more about each tab.
      </p>
      <Accordion>
        <Accordion.Item eventKey="summary">
          <Accordion.Header as="h3">
            <span className="fw-semibold">Summary</span>
          </Accordion.Header>
          <Accordion.Body>
            <p className="text-muted small mb-3">
              Here you can view the details of every venue associated with the
              group. This page is a read-only view and is designed to provide
              information. Group venues can be sorted in multiple ways, and can
              also be filtered by name or type using the input box at the top of
              the page.
            </p>
            <p className="text-muted small mb-0">
              When viewing on a mobile device, the venues are shown as
              individual cards and are split into two sections (venue info and
              rating details) which are individually interactive. When viewing
              on a desktop device the venues are shown in a table, and all
              details are displayed at once by selecting the relevant row. Venue
              info is only available if the venue has been added using the
              Google search box. If so, you can view the venue opening times and
              map location, get directions, and visit the external website.
            </p>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="manage-venues">
          <Accordion.Header as="h3">
            <span className="fw-semibold">Manage Venues</span>
          </Accordion.Header>
          <Accordion.Body>
            <p className="text-muted small mb-3">
              Here you can add and remove venues, amend the details of every
              venue associated with the group, and provide your ratings for each
              venue. Group venues can be sorted in multiple ways, and can also
              be filtered by name or type using the input box at the top of the
              page.
            </p>
            <p className="text-muted small mb-3">
              To add a venue to the group, click the Add Venue button at the top
              of the page, then fill in the details. If a venue is added using
              the Google search box, an address will appear underneath the venue
              name and more information will be viewable in the venue summary
              page.
            </p>
            <p className="text-muted small mb-3">
              When viewing venues on a mobile device, the venues are shown as
              individual cards and are split into two sections (venue info and
              rating details) which are individually interactive. When viewing
              on a desktop device the venues are shown in a table, and all
              details are displayed at once by selecting the relevant row. To
              edit the details of a venue, or to delete a venue, select any
              existing venue from this view.
            </p>
            <p className="text-muted small mb-0">
              This page is also used to provide ratings for each venue. In
              mobile view, ratings can only be provided once a venue has been
              marked as visited, to optimise the user experience. In desktop
              view, venues can be rated at any time.
            </p>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="manage-options">
          <Accordion.Header as="h3">
            <span className="fw-semibold">Manage Options</span>
          </Accordion.Header>
          <Accordion.Body>
            <p className="text-muted small mb-3">
              This page allows you to manage every set of options for the group.
              Each set of options is fully customisable per group. This means
              that each group can provide their own names for each set of
              options, such as the food quality and the venue type.
            </p>
            <p className="text-muted small mb-0">
              Option sets are split into <strong>type</strong> options which are
              listed alphabetically, and <strong>rating</strong> options which
              must be ordered from best to worst. Default values are initially
              mapped to each set of options in the group but each set can be
              swapped out for a custom set of options at any time, with minimal
              disruption to existing ratings and types.
            </p>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="group-members">
          <Accordion.Header as="h3">
            <span className="fw-semibold">Group Members</span>
          </Accordion.Header>
          <Accordion.Body>
            <p className="text-muted small mb-0">
              This page shows all members of the current group by display name,
              additionally marking the group's creator and the active status of
              each group member.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default FurtherInformationPage;
