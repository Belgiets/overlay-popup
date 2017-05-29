<h2>Overlay popup jquery plugin</h2>
<code>
    <pre>
    $(document).ready(function () {
        $('#overlay-popup').overlayPopup({
            callBtn: $('.show-popup')
        });
    });
    </pre>
</code>
<table>
    <tr>
        <th>Option</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>callBtn</td>
        <td>jQuery object to show overlay-popup by click</td>
    </tr>
    <tr>
        <td>beforeShow</td>
        <td>Callback before show the overlay popup</td>
    </tr>
    <tr>
        <td>beforeHide</td>
        <td>Callback before hide the overlay popup</td>
    </tr>
    <tr>
        <td>afterInit</td>
        <td>Callback after overlay popup init. Overlay jquery object available by parameter - afterInit: function(overlay) {}</td>
    </tr>
    <tr>
        <td>closeBtn</td>
        <td>Custom close button selector - . If not exists overlay-popup creates default close button.</td>
    </tr>
    <tr>
        <td>position</td>
        <td>Not implemented yet</td>
    </tr>
    <tr>
        <td>overlayColor</td>
        <td>Overlay color(behind the content), rgba(0,0,0,.7) by default</td>
    </tr>
    <tr>
        <td>popupColor</td>
        <td>Overlay popup content section background color</td>
    </tr>
    <tr>
        <td>width, height</td>
        <td>Any width/height (%, px, vw/vh, etc)</td>
    </tr>
</table>